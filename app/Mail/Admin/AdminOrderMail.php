<?php

namespace App\Mail\Admin;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class AdminOrderMail extends Mailable
{
    use Queueable, SerializesModels;

    private $order;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.html.admin_order_mail')
            ->text('mail.text.admin_order_mail')
            ->from(config('define.admin_email.from.address'), config('define.admin_email.from.name'))
            ->subject("受注・決済完了のお知らせ")
            ->with([
                'order' => $this->order,
            ]);
    }
}
