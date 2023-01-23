import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import ItemOrderTable from '../../../organisms/admin/Table/ItemOrderTable';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';

function OrderEdit(props) {
    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/orders/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ORDER';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData} = useFetchApiData(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, handleFormDate}] = useForm(data.order);
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);


    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>受注明細</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            updateData({
                                form: formData, 
                                url: `/api/admin/orders/${props.match.params.id}`,
                                callback: () => history.push('/admin/orders')
                            });
                        }}>
                            <div className={styles.mb_32}>
                                <div className={[styles.scroll_x, styles.mb_16].join(' ')}>
                                    <ItemOrderTable order={formData} />
                                </div>
                                <div>
                                    <div className={[styles.amount, styles.mb_4].join(' ')}>
                                        <Text>小計</Text> <Text>{formData.sub_total_text}</Text>
                                    </div>
                                    <div className={[styles.amount, styles.mb_4].join(' ')}>
                                        <Text>消費税合計</Text> <Text>{formData.tax_amount_text}</Text>
                                    </div>
                                    <div className={[styles.amount, styles.amount_border].join(' ')}>
                                        <Text>税込合計</Text> <Text>{formData.total_amount_text}</Text>
                                    </div>
                                </div>
                            </div>
                            <div className={[styles.flex, styles.flex_sp].join(' ')}>
                                <FormDatePicker
                                    name={'delivery_date'} 
                                    value={formData.delivery_date} 
                                    onChange={handleFormDate} 
                                    label={'配達希望日'} 
                                    className={[styles.mr_24, styles.mb_16].join(' ')}
                                    error={errorMessage}
                                    openTo="date"
                                />
                                <FormSelectbox
                                    name='delivery_time'
                                    value={formData.delivery_time}
                                    onChange={handleFormData}
                                    label={'配達希望時間帯'}
                                    error={errorMessage}
                                    className={[styles.flex_grow, styles.mb_16].join(' ')}
                                >
                                    <option value={''}>未設定</option>
                                    <option value={'8:00 - 12:00'}>8:00 - 12:00</option>
                                    <option value={'14:00 - 16:00'}>14:00 - 16:00</option>
                                    <option value={'16:00 - 18:00'}>16:00 - 18:00</option>
                                    <option value={'18:00 - 20:00'}>18:00 - 20:00</option>
                                </FormSelectbox>
                            </div>

                            <div className={[styles.flex, styles.mb_40, styles.flex_sp].join(' ')}>
                                <FormSelectbox
                                    name='is_paid'
                                    value={formData.is_paid}
                                    onChange={handleFormData}
                                    label={'入金状況'}
                                    error={errorMessage}
                                    className={[styles.flex_basis_50, styles.mr_24, styles.mb_16].join(' ')}
                                >
                                    <option value={0}>未入金</option>
                                    <option value={1}>入金済</option>
                                </FormSelectbox>
                                <FormSelectbox
                                    name='is_shipped'
                                    value={formData.is_shipped}
                                    onChange={handleFormData}
                                    label={'出荷状況'}
                                    error={errorMessage}
                                    className={[styles.flex_basis_50, styles.mb_16].join(' ')}
                                >
                                    <option value={0}>未配送</option>
                                    <option value={1}>配送済</option>
                                </FormSelectbox>
                            </div>

                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/orders`} size='l' className={styles.mr_12} style={{'width': '100%'}} >一覧に戻る</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>更新する</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default OrderEdit;
