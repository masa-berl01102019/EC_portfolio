<?php

namespace App\Mail\Admin;

use App\Models\PasswordReset;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class AdminResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    private $password_reset;
    private $admin_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(PasswordReset $password_reset, $admin_name)
    {
        $this->password_reset = $password_reset;
        $this->admin_name = $admin_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.html.admin_reset_password_mail')
            ->text('mail.text.admin_reset_password_mail')
            ->from(config('define.admin_email.from.address'), trans('mail.admin.from.name'))
            ->subject(trans('mail.admin.reset_password.subject'))
            ->with([
                'password_reset' => $this->password_reset,
                'admin_name' => $this->admin_name,
            ]);
    }
}
