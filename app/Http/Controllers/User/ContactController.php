<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Contact;
use App\Mail\User\UserContactMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Mail\Admin\AdminContactMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\user\ContactRequest;

class ContactController extends Controller
{
    private $form_items = ['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'tel', 'email', 'subject', 'message'];

    public function store(ContactRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $contact = Contact::create([
                'user_id' => Auth::guard('user')->check() ? Auth::guard('user')->user()->id : null,
                'last_name' => $data['last_name'],
                'first_name' => $data['first_name'],
                'last_name_kana' => $data['last_name_kana'],
                'first_name_kana' => $data['first_name_kana'],
                'tel' => $data['tel'],
                'email' => $data['email'],
                'subject' => $data['subject'],
                'message' => $data['message'],
            ]);
            Mail::to($contact->email)->send(new UserContactMail($contact));
            Mail::to(config('define.admin_email.to.support'))->send(new AdminContactMail($contact));
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.contacts.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.contacts.create_err')], 500);
        }
    }
}
