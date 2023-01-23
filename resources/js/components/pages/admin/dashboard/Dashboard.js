import React from 'react';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';

function Dashboard() {
    return (
        <main>
            <div className={styles.container}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>Dashboardページ</Heading>
                <Text>第二フェーズにて開発予定</Text>
            </div>
        </main>
    );
}

export default Dashboard;
