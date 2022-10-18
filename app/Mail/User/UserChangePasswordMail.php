<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserChangePasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    private $user_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name)
    {
        $this->user_name = $user_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.html.user_change_password_mail')
            ->text('mail.text.user_change_password_mail')
            ->from(config('define.user_email.from.address'), config('define.user_email.from.name'))
            ->subject("パスワード変更完了のお知らせ")
            ->with([
                'user_name' => $this->user_name,
            ]);
    }
}
