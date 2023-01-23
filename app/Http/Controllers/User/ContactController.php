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
use App\Http\Requests\User\ContactRequest;

class ContactController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'tel', 'email', 'title', 'body' ];


    public function store(ContactRequest $request)
    {
        // 項目制限
        $data = $request->only($this->form_items);

        DB::beginTransaction();
        try {
            // 編集項目をDBに保存
            $contact = Contact::create([
                'user_id' => Auth::guard('user')->check() ? Auth::guard('user')->user()->id : null,
                'last_name' => $data['last_name'],
                'first_name' => $data['first_name'],
                'last_name_kana' => $data['last_name_kana'],
                'first_name_kana' => $data['first_name_kana'],
                'tel' => $data['tel'],
                'email' => $data['email'],
                'title' => $data['title'],
                'body' => $data['body'],
            ]);

            // メール配信
            Mail::to($contact->email)->send(new UserContactMail($contact));
            Mail::to(config('define.admin_email.to.support'))->send(new AdminContactMail($contact));

            DB::commit();
            return response()->json(['create' => true, 'message' => 'お問い合わせの登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['create' => false, 'message' => 'お問い合わせの登録に失敗しました'], 200);
        }


    }

}
