import React from 'react';

// Reactのデフォルトではエラー発生時は全てのコンポーネントが強制的にアンマウントされるため画面が真っ白になる
// Error Boundaryはコンポーネントでエラーが発生した場合にフォールバック(代替表示)を提供する仕組み
// Error Boundaryはクラスコンポーネントとして実装される ＊現時点ではHooks未対応
//
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
        this.setState({error, errorInfo})
    }

    render() {
        // エラー時の表示
        if (this.state.hasError) {
            // fallbackが設定されてるかで表示を切り替え
            if (this.props.fallback) {
                return this.props.fallback;
            } else {
                return(
                    // 本番用のエラーメッセージ
                    // <div style={{'color': 'red', 'textAlign': 'center'}}>アプリケーションエラーにより表示できません。時間を置いて、再度更新してください。</div>
    
                    // 開発環境用のメッセージ
                    <div style={{'width': '300px', 'margin': '0 auto'}}>
                        <h3>JavaScriptの致命的エラー</h3>
                        <p style={{'margin': '0'}}>{this.state.error?.message}</p>
                        <pre style={{'fontFamily': 'monospace'}}>
                        {this.state.errorInfo?.componentStack}
                        </pre>
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