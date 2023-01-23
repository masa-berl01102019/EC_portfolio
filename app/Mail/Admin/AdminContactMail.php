<?php

namespace App\Mail\Admin;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class AdminContactMail extends Mailable
{
    use Queueable, SerializesModels;

    private $contact;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.html.admin_contact_mail')
            ->text('mail.text.admin_contact_mail')
            ->from(config('define.admin_email.from.address'), config('define.admin_email.from.name'))
            ->subject("お問い合わせのお知らせ")
            ->with([
                'contact' => $this->contact,
            ]);
    }
}
