<?php

namespace App\Mail\User;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserContactMail extends Mailable
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
        return $this->view('mail.html.user_contact_mail')
            ->text('mail.text.user_contact_mail')
            ->from(config('define.user_email.from.address'), trans('mail.user.from.name'))
            ->subject(trans('mail.user.contact.subject'))
            ->with([
                'contact' => $this->contact,
            ]);
    }
}
