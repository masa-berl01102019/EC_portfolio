<?php

namespace App\Mail\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class AdminChangePasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    private $admin_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($admin_name)
    {
        $this->admin_name = $admin_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.html.admin_change_password_mail')
            ->text('mail.text.admin_change_password_mail')
            ->from(config('define.admin_email.from.address'), trans('mail.admin.from.name'))
            ->subject(trans('mail.admin.change_password.subject'))
            ->with([
                'admin_name' => $this->admin_name,
            ]);
    }
}
