import React from 'react';
import Heading from './atoms/Heading/Heading';
import Text from './atoms/Text/Text';

// Error Boundary is not compatible to Hooks
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        // Initialize
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state to show fallback UI
        return { 
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        // Set error message
        this.setState({error, errorInfo});
    }

    render() {
        // Display error page
        if (this.state.hasError) {
            // Switch fallback UI or error message which is set.
            if (this.props.fallback) {
                return this.props.fallback;
            } else {
                return(
                    <div style={{'width': '90%', 'margin': '90px auto', 'textAlign': 'center'}}>
                        <Heading tag='h1' tag_style='h1' style={{'marginBottom': '32px'}}>
                            Application error
                        </Heading>
                        <Text size='l'style={{'marginBottom': '24px'}}>There might be cause of below message.</Text>
                        <Text style={{'marginBottom': '24px'}}>
                            ・{(this.state.error?.response?.data?.message) ? this.state.error?.response?.data?.message : this.state.error?.message}
                        </Text>
                        <Text size='l'>Please reload your browser again.</Text>
                    </div>
                );
            }
        }
        // Display children component if there is no error
        return this.props.children;
    }
}

export default ErrorBoundary;