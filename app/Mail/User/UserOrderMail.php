<?php

namespace App\Mail\User;

use Carbon\Carbon;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserOrderMail extends Mailable
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
        return $this->view('mail.html.user_order_mail')
            ->text('mail.text.user_order_mail')
            ->from(config('define.user_email.from.address'), config('define.user_email.from.name'))
            ->subject("ご注文・決済完了のお知らせ")
            ->with([
                'order' => $this->order,
            ]);
    }
}
