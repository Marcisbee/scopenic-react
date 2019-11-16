import React, { Component } from 'react';

import styles from './error-boundary.module.scss';

class ErrorBoundaryChild extends Component<{ title: string, silent?: boolean }> {
  public state = {
    error: null,
    errorInfo: null,
  };

  public componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.errorInfo) {
      if (this.props.silent) {
        return null;
      }

      return (
        <div className={styles.container}>
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <path d="M0 0L24 0 24 24 0 24z" />
                <path
                  fill="#B0A8FF"
                  d="M14.834 13.422l3.874 3.873a.999.999 0 01-1.413 1.413l-3.873-3.874a.999.999 0 011.412-1.412z"
                  className="primary"
                />
                <path
                  fill="#594BC8"
                  d="M6.705 18.708a.999.999 0 01-1.413-1.413L10.588 12 5.292 6.705a.999.999 0 111.413-1.413L12 10.588l5.295-5.296a.999.999 0 111.413 1.413L6.705 18.708z"
                  className="secondary"
                />
              </g>
            </svg>
          </div>

          <div>
            <h1>{this.props.title}</h1>
            <h4>{this.state.error && (this.state.error as any).message}</h4>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary: React.FC<{ silent?: boolean }> = React.memo((props) => {
  return <ErrorBoundaryChild title="Something bad happened" {...props} />;
}, () => false);

export default ErrorBoundary;
