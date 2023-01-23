<?php

namespace App\Mail\User;

use App\Models\PasswordReset;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    private $password_reset;
    private $user_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(PasswordReset $password_reset, $user_name)
    {
        $this->password_reset = $password_reset;
        $this->user_name = $user_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.html.user_reset_password_mail')
            ->text('mail.text.user_reset_password_mail')
            ->from(config('define.user_email.from.address'), trans('mail.user.from.name'))
            ->subject(trans('mail.user.reset_password.subject'))
            ->with([
                'password_reset' => $this->password_reset,
                'user_name' => $this->user_name,
            ]);
    }
}
