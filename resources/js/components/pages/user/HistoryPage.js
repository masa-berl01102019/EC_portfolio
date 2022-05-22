import React from 'react';
import {Link} from 'react-router-dom';
import { useCookies } from 'react-cookie';

function HistoryPage() {

    // cookieを管理
    const [cookies, setCookie] = useCookies();

    // 描画のみを担当
    return (
        <>
          <h1>閲覧履歴</h1>
          {
              <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                  {
                      cookies.item_info&&
                      <ul style={{'display': 'flex', 'flexFlow': 'wrap'}}> 
                          {                        
                              cookies.item_info.map((list) =>
                                  <li key={list.id}>
                                      <Link to={`/items/${list.id}`} style={{'display': 'block', 'width': '150px', 'overflow': 'hidden'}}>
                                          <span><img src={list.top_image} alt="" style={{ 'width':'150px', 'height': '150px' }}/></span><br/>
                                          <span>{list.item_name}</span><br/>
                                          <span>{list.included_tax_price_text} (税込)</span><br/>
                                          <span>{list.brand_name}</span>
                                      </Link>
                                  </li>
                              )
                          }
                      </ul>
                  }
              </ul>
          }
        </>
    );
}

export default HistoryPage;