import ReactDOM from 'react-dom';

const ModalNode = document.getElementById('modal');

const ModalPortal: React.FC<{ children: any }> = ({ children }) => {
  if (!ModalNode) {
    return children;
  }

  return ReactDOM.createPortal(children, ModalNode);
};

export default ModalPortal;
