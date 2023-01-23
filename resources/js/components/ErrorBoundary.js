import React from 'react';
import Heading from './atoms/Heading/Heading';
import Text from './atoms/Text/Text';

// Reactのデフォルトではエラー発生時は全てのコンポーネントが強制的にアンマウントされるため画面が真っ白になる
// Error Boundaryはコンポーネントでエラーが発生した場合にフォールバック(代替表示)を提供する仕組み
// Error Boundaryはクラスコンポーネントとして実装される ＊現時点ではHooks未対応

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        // 初期化
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // 次のレンダリングでフォールバック UI が表示されるように状態を更新
        return { 
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        // エラーメッセージとエラーの詳細情報をセット
        this.setState({error, errorInfo});
    }

    render() {
        // エラー時の表示
        if (this.state.hasError) {
            // fallbackが設定されてるかで表示を切り替え
            if (this.props.fallback) {
                return this.props.fallback;
            } else {
                return(
                    <div style={{'width': '90%', 'margin': '90px auto', 'textAlign': 'center'}}>
                        <Heading tag='h1' tag_style='h1' style={{'marginBottom': '32px'}}>
                            アプリケーションエラー
                        </Heading>
                        <Text size='l'style={{'marginBottom': '24px'}}>以下の原因が挙げられます</Text>
                        <Text style={{'marginBottom': '24px'}}>
                            ・{(this.state.error?.response?.data?.message) ? this.state.error?.response?.data?.message : this.state.error?.message}
                        </Text>
                        <Text size='l'>ブラウザの再読み込みを行ってください</Text>
                    </div>
                );
            }
        }
        // エラーがない時は子（括った内部のコンポーネント）を表示
        return this.props.children;
    }
}

export default ErrorBoundary;
// export default したものを import するときには {} を使わない
// 1 ファイル内で、1 export defaultのみ(通常は export は複数使用できる)
// なので、1ファイル1コンポーネントであれば、 export default を使う場合方がいい