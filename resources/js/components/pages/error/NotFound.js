import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

function NotFound() {
    return (
        <main className={styles.mt_40}>
            <Heading tag='h1' tag_style='h1' className={styles.section_title}>404 Not Found</Heading>
            <Text size='l' role='title' className={styles.text_center}>お探しのページは見つかりませんでした</Text>
        </main>
    );
}

export default NotFound;
