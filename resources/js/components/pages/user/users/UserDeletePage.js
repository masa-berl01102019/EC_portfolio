import React, {Suspense} from 'react';
import {Link, useLocation, useHistory} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import useAuth from "../../../hooks/useAuth";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function UserDeletePage() {
    // urlの設定
    const baseUrl = `/api/user/users/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'USER';
    // APIと接続して返り値を取得
    const {data, errorMessage, deleteData} = useFetchApiData2(baseUrl, model);
    // 退会用のIDを取得
    const {state} = useLocation();
    // Auth hooksの呼び出し
    const {handleLogout} = useAuth('user');
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                            退会の手続き
                        </Heading>
                        <div className={styles.form_contents_area}>
                            <Text className={[styles.paragraph, styles.mb_16].join(' ')}>
                                退会手続きは取り消すことが出来ません。<br/>
                                下記の注意事項をご確認の上、<br/>
                                「退会する」ボタンを押してください。
                            </Text>
                            <Text role='error' className={[styles.paragraph, styles.mb_8].join(' ')}>
                                退会後は登録内容の確認はできなくなります。
                            </Text>
                            <Text role='error'  className={[styles.paragraph, styles.mb_32].join(' ')}>
                                既にご注文いただきました商品は、<br/>
                                退会後も発送を行わせていただきます。
                            </Text>
                            <div className={[styles.flex, styles.flex_column, styles.align_center].join(' ')}>
                                <Button 
                                    size='l'
                                    color='primary'
                                    onClick={() => {
                                        let answer = confirm(`本当に退会しますか？`);
                                        if(answer) {
                                            // 削除処理 TODO: 削除した後にログアウトの処理等でエラーが出るとこ修正
                                            deleteData({
                                                url:`/api/user/users/${state}`,
                                                callback: () => {
                                                    handleLogout();
                                                    history.push('/');
                                                }
                                            });
                                        } 
                                    }}
                                    className={[styles.mb_16, styles.btn_max].join(' ')}
                                >
                                    退会する
                                </Button>
                                <LinkBtn size='l' to={`/`} className={styles.btn_max}>退会しない</LinkBtn>
                            </div>
                        </div>
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default UserDeletePage;