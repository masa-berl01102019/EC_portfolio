<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ContactResource;
use App\Http\Requests\admin\ContactRequest;

class ContactController extends Controller
{
    private $form_items = ['user_id', 'response_status', 'memo'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_contact = Contact::with('admin');
            $search_contact->filterKeyword($request, ['contacts.last_name', 'contacts.first_name', 'contacts.last_name_kana', 'contacts.first_name_kana']);
            $search_contact->filterDateRange($request, 'contacts');
            $search_contact->filterResponseStatus($request);
            // last_name > created_at > updated_at
            $search_contact->orderByName($request);
            $search_contact->orderByCreatedAt($request);
            $search_contact->orderByUpdatedAt($request);
            $contacts = $search_contact->customPaginate($request);
            return ContactResource::collection($contacts);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.contacts.get_err')], 500);
        }
    }

    public function edit(Contact $contact)
    {
        try {
            return new ContactResource($contact);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.contacts.get_err')], 500);
        }
    }

    public function update(ContactRequest $request, Contact $contact)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $contact->fill([
                'admin_id' => Auth::guard('admin')->id(),
                'response_status' => $data['response_status'],
                'memo' => $data['memo'],
                'updated_at' => Carbon::now(),
            ])->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.contacts.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.contacts.update_err')], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $contacts = $request->all();
            foreach ($contacts as $contact) {
                $contact = Contact::find($contact);
                $contact->delete();
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.contacts.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.contacts.delete_err')], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $contacts = Contact::whereIn('id', $id)->with('admin')->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($contacts as $contact) {
                $csv_body[] = [
                    $num,
                    $contact->id,
                    $contact->user_id ? $contact->user_id : null,
                    $contact->full_name,
                    $contact->full_name_kana,
                    $contact->tel,
                    $contact->email,
                    $contact->created_at,
                    $contact->subject,
                    $contact->message,
                    $contact->response_status_text,
                    $contact->admin ? $contact->admin->full_name . '(' . $contact->admin->full_name_kana . ')' : null,
                    $contact->memo ? $contact->memo : null,
                    $contact->updated_at,
                ];
                $num++;
            }
            $csv_header = trans('api.admin.contacts.csv_header');
            return csvExport($csv_body, $csv_header, trans('api.admin.contacts.csv_file_name'));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.contacts.csv_err')], 500);
        }
    }
}
