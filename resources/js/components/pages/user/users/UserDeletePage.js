import React, {Suspense} from 'react';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useAuth from "../../../hooks/useAuth";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useSetRecoilState } from 'recoil';
import { authUserState } from '../../../store/authState';
import useNotify from '../../../context/NotifyContext';

function UserDeletePage() {
    // urlの設定
    const baseUrl = `/api/user/users/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'USER';
    // APIと接続して返り値を取得
    const {data, errorMessage, deleteData} = useFetchApiData(baseUrl, model);
    // Auth hooksの呼び出し
    const {handleLogout} = useAuth('/api/user/auth', 'user');
    // loginのステートをfalseにしてrouterを呼び出しリダイレクト掛ける
    const setIsUserLogin = useSetRecoilState(authUserState);

    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async (id) => {
        const result = await confirm({
            body : `本当に退会しますか？`,
            confirmBtnLabel : 'はい'
        });
        result && deleteData({
            url:`/api/user/users/${id}`,
            callback: () => {
                handleLogout();
                setIsUserLogin(false);
            }
        });
    }

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
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
                            onClick={() => handleConfirmDelete(data.user.id)}
                            className={[styles.mb_16, styles.btn_max].join(' ')}
                        >
                            退会する
                        </Button>
                        <LinkBtn size='l' to={`/`} className={styles.btn_max}>退会しない</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserDeletePage;