import React from 'react';

export const AlertIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path fill="#B0A8FF" d="M9 19H15V21H9z" className="primary"/>
        <path
          fill="#594BC8"
          d="M16 20.4v-.8a.6.6 0 01.6-.6h2.365a.4.4 0 00.349-.596L12.348 6.048a.4.4 0 00-.697 0L4.686 18.404a.4.4 0 00.349.596H7.4a.6.6 0 01.6.6v.8a.6.6 0 01-.6.6H3.671A1.664 1.664 0 012 19.343c0-.285.074-.565.215-.813l8.328-14.685a1.679 1.679 0 012.913 0l8.33 14.685a1.65 1.65 0 01-.638 2.257c-.25.14-.532.213-.82.213H16.6a.6.6 0 01-.6-.6zM11.4 16h1.2c.22 0 .4.18.4.4v1.2a.4.4 0 01-.4.4h-1.2a.4.4 0 01-.4-.4v-1.2c0-.22.18-.4.4-.4zm0-7h1.2c.22 0 .4.18.4.4v5.2a.4.4 0 01-.4.4h-1.2a.4.4 0 01-.4-.4V9.4c0-.22.18-.4.4-.4z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M19.38 5.278a.948.948 0 011.342 0c.37.372.37.974 0 1.345L18.7 8.649a.949.949 0 01-1.342 0 .95.95 0 010-1.343l2.023-2.028z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M16.65 9.358a.95.95 0 01.001 1.343l-8.006 8.02a.948.948 0 01-1.342 0L3.278 14.69a.952.952 0 010-1.345.948.948 0 011.342 0l3.354 3.361 7.334-7.347a.949.949 0 011.342 0z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
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
  );
};

export const CommentsIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M10 8a1 1 0 110 2 1 1 0 010-2z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M17.874 6H18a4 4 0 014 4v4a4.002 4.002 0 01-3 3.874V20.4a.598.598 0 01-.909.51L12.723 18H11a3.989 3.989 0 01-2.92-1.267L5.908 17.91A.598.598 0 015 17.4v-2.526A4.002 4.002 0 012 11V7a4 4 0 014-4h8a4.002 4.002 0 013.874 3zM18 8v3a4 4 0 01-4 4h-2.723l-1.312.711A1.99 1.99 0 0011 16h2.277l3.42 2.052a.2.2 0 00.303-.171V16.6a.6.6 0 01.6-.6h.4a2 2 0 002-2v-4a2 2 0 00-2-2zM6 5a2 2 0 00-2 2v4a2 2 0 002 2h.4a.6.6 0 01.6.6v1.28a.2.2 0 00.303.172L10.723 13H14a2 2 0 002-2V7a2 2 0 00-2-2H6zm1 3a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const FlagIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <rect
          width="2"
          height="4"
          x="4"
          y="18"
          fill="#B0A8FF"
          className="primary"
          rx="1"
        />
        <path
          fill="#594BC8"
          d="M6 13v3a1 1 0 11-2 0V3a1 1 0 112 0c1.667-.667 3-1 4-1s2 .333 3 1 2 1 3 1c1.177 0 2.188-.333 3.033-.998.063-.05.16-.141.29-.274a.395.395 0 01.677.276v8.68a.91.91 0 01-.196.564C18.828 13.416 17.56 14 16 14c-1 0-2-.333-3-1s-2-1-3-1-2.333.333-4 1zm11.601-7.168A7.47 7.47 0 0116 6c-1.416 0-2.795-.46-4.11-1.336C11.206 4.207 10.585 4 10 4c-.7 0-1.806.276-3.257.857l-.54.216a.323.323 0 00-.203.3v5.064a.298.298 0 00.398.281C7.78 10.244 8.972 10 10 10c1.416 0 2.795.46 4.11 1.336.685.457 1.306.664 1.89.664.726 0 1.307-.182 1.804-.575a.572.572 0 00.196-.431V6.143a.32.32 0 00-.399-.311z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M10 12h4a1 1 0 010 2h-4a1 1 0 010-2z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M4 9.567l-.514.305a1 1 0 11-.971-1.749l8.028-4.745a3 3 0 012.914 0l8.028 4.745a1 1 0 01-.97 1.749L20 9.567V20.4a.6.6 0 01-.6.6h-5.8a.6.6 0 01-.6-.6v-3.2a.2.2 0 00-.2-.2h-1.6a.2.2 0 00-.2.2v3.2a.6.6 0 01-.6.6H4.6a.6.6 0 01-.6-.6V9.567zm2-1.184V18.8c0 .11.09.2.2.2h2.6a.2.2 0 00.2-.2V16a1 1 0 011-1h4a1 1 0 011 1v2.8c0 .11.09.2.2.2h2.6a.2.2 0 00.2-.2V8.383l-5.514-3.265a1 1 0 00-.972 0L6 8.383z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M12 17.5a2 2 0 100-4 2 2 0 000 4z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M6 9V8a6 6 0 1112 0v1h1a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v1zm9.6 2H6.4a.4.4 0 00-.4.4v8.2c0 .22.18.4.4.4h11.2a.4.4 0 00.4-.4v-8.2a.4.4 0 00-.4-.4z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M2.791 15.828a1.01 1.01 0 111.86-.785 8.109 8.109 0 004.305 4.305 1.01 1.01 0 11-.786 1.86 10.128 10.128 0 01-5.379-5.38z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M19.118 15.897c-.317.03-.64.046-.965.046-5.575 0-10.095-4.52-10.095-10.096 0-.326.015-.647.045-.965-2.492 1.431-4.084 4.076-4.084 7.022a1.01 1.01 0 01-2.019 0 10.099 10.099 0 018.073-9.893.548.548 0 01.614.75 8.077 8.077 0 0010.496 10.575c.328-.142.651-.014.772.264a.549.549 0 01.034.327A10.1 10.1 0 0112.096 22a1.01 1.01 0 110-2.02 8.079 8.079 0 007.022-4.083z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const NotificationIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M9.188 19h5.627a.18.18 0 01.179.191 3 3 0 01-5.988.003.182.182 0 01.182-.194z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M19 16h1a1 1 0 010 2H4a1 1 0 010-2h1l.502-6.02a6.523 6.523 0 014.7-5.728A1.5 1.5 0 0111.5 2h1a1.5 1.5 0 011.298 2.252 6.523 6.523 0 014.7 5.727L19 16zm-2.495-5.855a4.523 4.523 0 00-3.258-3.97l-.145-.042a4 4 0 00-2.204 0l-.145.041a4.523 4.523 0 00-3.258 3.971L7.007 16h9.986l-.488-5.855z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const PersonIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path fill="#B0A8FF" d="M10 19H14V21H10z" className="primary"/>
        <path
          fill="#594BC8"
          d="M15 20.4v-.8a.6.6 0 01.6-.6h1.2a.2.2 0 00.2-.2V17a4 4 0 00-4-4h-2a4 4 0 00-4 4v1.8c0 .11.09.2.2.2h1.2a.6.6 0 01.6.6v.8a.6.6 0 01-.6.6H5.6a.6.6 0 01-.6-.6V17a6 6 0 013.482-5.447 5 5 0 117.037 0A6 6 0 0119 17v3.4a.6.6 0 01-.6.6h-2.8a.6.6 0 01-.6-.6zM12 11a3 3 0 100-6 3 3 0 000 6z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const SettingIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M16 12a1 1 0 01-2 0 2 2 0 10-2 2 1 1 0 010 2 4 4 0 114-4z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M10.303 2h3.394a1.65 1.65 0 011.643 1.429l.136 1.05a.4.4 0 00.192.292l.892.528a.4.4 0 00.355.026l1.098-.45a1.666 1.666 0 012.063.685l1.697 2.861c.427.72.236 1.64-.438 2.138l-1.059.783a.4.4 0 00-.162.321v.674a.4.4 0 00.162.321l1.06.783c.673.497.864 1.417.437 2.138l-1.697 2.86a1.666 1.666 0 01-2.063.685l-1.098-.45a.4.4 0 00-.355.027l-.892.528a.4.4 0 00-.192.293l-.136 1.05A1.65 1.65 0 0113.697 22h-3.394a1.65 1.65 0 01-1.643-1.429l-.136-1.05a.4.4 0 00-.192-.292l-.892-.528a.4.4 0 00-.355-.026l-1.098.45a1.666 1.666 0 01-2.063-.685l-1.697-2.861a1.624 1.624 0 01.438-2.138l1.059-.783a.4.4 0 00.162-.321v-.674a.4.4 0 00-.162-.321l-1.06-.783a1.624 1.624 0 01-.437-2.138l1.697-2.86a1.666 1.666 0 012.063-.685l1.098.45a.4.4 0 00.355-.027l.892-.528a.4.4 0 00.192-.293l.136-1.05A1.65 1.65 0 0110.303 2zm.024 3.063a1.777 1.777 0 01-.863 1.3l-1.212.714a1.804 1.804 0 01-1.592.115l-.828-.336a.4.4 0 00-.494.165L4.187 8.947a.4.4 0 00.107.528l.775.569c.458.335.727.865.727 1.43v1.052c0 .565-.27 1.095-.727 1.43l-.775.569a.4.4 0 00-.107.528l1.15 1.926a.4.4 0 00.495.165l.828-.336a1.804 1.804 0 011.592.115l1.212.713c.474.28.792.759.863 1.301l.094.715a.4.4 0 00.396.348h2.366a.4.4 0 00.396-.348l.094-.715c.07-.542.389-1.022.863-1.3l1.212-.714a1.804 1.804 0 011.592-.115l.828.336a.4.4 0 00.494-.165l1.151-1.926a.4.4 0 00-.107-.528l-.775-.569a1.773 1.773 0 01-.727-1.43v-1.052c0-.565.27-1.095.727-1.43l.775-.569a.4.4 0 00.107-.528l-1.15-1.926a.4.4 0 00-.495-.165l-.828.336c-.52.212-1.109.169-1.592-.115l-1.212-.713a1.777 1.777 0 01-.863-1.301l-.094-.715A.4.4 0 0013.183 4h-2.366a.4.4 0 00-.396.348l-.094.715z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <rect
          width="2"
          height="2"
          x="18"
          y="9"
          fill="#B0A8FF"
          className="primary"
          rx="0.4"
        />
        <path
          fill="#594BC8"
          d="M6 12.75c0 .51.095 1.017.29 1.535.219.58.483 1.082.79 1.509.338.47.747.934 1.23 1.394.514.489.98.888 1.395 1.197.435.322.888.627 1.36.914.437.266.753.452.935.55.18-.098.498-.284.935-.55.472-.287.926-.592 1.36-.914.414-.308.88-.708 1.395-1.197.483-.46.892-.925 1.23-1.394.307-.427.57-.929.79-1.51.195-.516.29-1.024.29-1.534v-.15a.6.6 0 01.6-.6h.8a.6.6 0 01.6.6v.15c0 .754-.14 1.5-.419 2.24a8.505 8.505 0 01-1.037 1.971 11.968 11.968 0 01-1.475 1.676c-.571.543-1.098.994-1.582 1.353-.483.359-.987.698-1.512 1.018-.525.32-.898.537-1.119.65-.22.114-.398.202-.53.263A.688.688 0 0112 22a.688.688 0 01-.325-.08 13.32 13.32 0 01-.531-.262 21.33 21.33 0 01-1.12-.65c-.524-.32-1.028-.659-1.512-1.018-.483-.36-1.01-.81-1.58-1.353a11.95 11.95 0 01-1.476-1.676 8.481 8.481 0 01-1.037-1.97A6.304 6.304 0 014 12.75V5.686c0-.228.08-.425.237-.591a.751.751 0 01.563-.25c3.101-.915 5.206-1.72 6.315-2.417.114-.071.254-.165.422-.281a.8.8 0 01.926 0c.168.116.309.21.423.282 1.108.696 3.213 1.501 6.314 2.416.217 0 .404.084.563.25a.83.83 0 01.237.591V7.4a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6v-.825c-2.786-.845-4.764-1.61-6-2.343-1.236.733-3.214 1.498-6 2.343v6.175zm5.414-.364l3.123-3.22a.54.54 0 01.78 0l.521.537a.582.582 0 010 .805l-4.033 4.159a1.08 1.08 0 01-1.562 0L8.162 12.52a.582.582 0 010-.805l.52-.536a.54.54 0 01.78 0l1.172 1.207a.54.54 0 00.78 0z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M18.647 4.505l.848.848a.4.4 0 010 .566l-.848.848a.4.4 0 01-.566 0l-.848-.848a.4.4 0 010-.566l.848-.848a.4.4 0 01.566 0zM5.919 17.233l.848.848a.4.4 0 010 .566l-.848.848a.4.4 0 01-.566 0l-.848-.848a.4.4 0 010-.566l.848-.848a.4.4 0 01.566 0zM5.353 4.505a.4.4 0 01.566 0l.848.848a.4.4 0 010 .566l-.848.848a.4.4 0 01-.566 0l-.848-.848a.4.4 0 010-.566l.848-.848zm12.728 12.728a.4.4 0 01.566 0l.848.848a.4.4 0 010 .566l-.848.848a.4.4 0 01-.566 0l-.848-.848a.4.4 0 010-.566l.848-.848z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M12 19a7 7 0 110-14 7 7 0 010 14zm0-2a5 5 0 100-10 5 5 0 000 10zm-.6-15h1.2c.22 0 .4.18.4.4v1.2a.4.4 0 01-.4.4h-1.2a.4.4 0 01-.4-.4V2.4c0-.22.18-.4.4-.4zm0 18h1.2c.22 0 .4.18.4.4v1.2a.4.4 0 01-.4.4h-1.2a.4.4 0 01-.4-.4v-1.2c0-.22.18-.4.4-.4zM22 11.4v1.2a.4.4 0 01-.4.4h-1.2a.4.4 0 01-.4-.4v-1.2c0-.22.18-.4.4-.4h1.2c.22 0 .4.18.4.4zm-18 0v1.2a.4.4 0 01-.4.4H2.4a.4.4 0 01-.4-.4v-1.2c0-.22.18-.4.4-.4h1.2c.22 0 .4.18.4.4z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const LayersIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#594BC8"
          d="M5 11v8h14v-8H5zm0-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"
          className="primary"
        />
        <path
          fill="#B0A8FF"
          d="M5 6h14a1 1 0 010 2H5a1 1 0 110-2zm1-3h12a1 1 0 010 2H6a1 1 0 110-2z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const TypefaceIcon: React.FC <{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#B0A8FF"
          d="M5.97139599 12L9.02544433 12 9.27994836 14 5.71689197 14z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M20.998 12v7.8a.2.2 0 01-.2.2h-.627a.2.2 0 01-.198-.171l-.146-1A3.987 3.987 0 0116.998 20h-.5a3.5 3.5 0 01-3.5-3.5V16a3 3 0 013-3h2.6a.4.4 0 00.4-.4V12a2 2 0 00-3.887-.665c-.183.521-2.07-.143-1.886-.664A4 4 0 0120.998 12zm-5 3a1 1 0 00-1 1v.5a1.5 1.5 0 001.5 1.5h.5a2 2 0 002-2v-.6a.4.4 0 00-.4-.4h-2.6zm-7.69-8.644A.407.407 0 007.902 6h-.81a.407.407 0 00-.403.356L5.02 19.466a.61.61 0 01-.606.534h-.804a.61.61 0 01-.606-.688L4.73 5.748A2 2 0 016.715 4h1.567a2 2 0 011.984 1.748l1.726 13.564a.61.61 0 01-.606.688h-.805a.61.61 0 01-.605-.534L8.307 6.356z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const TextIcon: React.FC <{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M0 0L24 0 24 24 0 24z"/>
        <path
          fill="#594BC8"
          d="M9 14.6v-4.117a.2.2 0 00-.341-.142L8.5 10.5c-.32.32-.754.5-1.207.5H6a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2h-1.293c-.453 0-.887-.18-1.207-.5l-.159-.159a.2.2 0 00-.341.142V14.6c0 .22.18.4.4.4h1.1a1.5 1.5 0 011.5 1.5V19a2 2 0 01-2 2H8a2 2 0 01-2-2v-2.5A1.5 1.5 0 017.5 15h1.1a.4.4 0 00.4-.4zm1 2.4H8.4a.4.4 0 00-.4.4v1.2c0 .22.18.4.4.4h7.2a.4.4 0 00.4-.4v-1.2a.4.4 0 00-.4-.4H14a1 1 0 01-1-1V7.6a.6.6 0 01.6-.6h.782a1 1 0 01.894.553l.613 1.226a.4.4 0 00.358.221H17.6a.4.4 0 00.4-.4V5.4a.4.4 0 00-.4-.4H6.4a.4.4 0 00-.4.4v3.2c0 .22.18.4.4.4h1.353a.4.4 0 00.358-.221l.613-1.226A1 1 0 019.618 7h.782a.6.6 0 01.6.6V16a1 1 0 01-1 1z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const ContainerIcon: React.FC <{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#B0A8FF"
          d="M17 7.4v9.2a.4.4 0 01-.4.4H7.4a.4.4 0 01-.4-.4V7.4c0-.22.18-.4.4-.4h9.2c.22 0 .4.18.4.4zm-8 2v5.2c0 .22.18.4.4.4h5.2a.4.4 0 00.4-.4V9.4a.4.4 0 00-.4-.4H9.4a.4.4 0 00-.4.4z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M21 4v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1zM5 5.4v13.2c0 .22.18.4.4.4h13.2a.4.4 0 00.4-.4V5.4a.4.4 0 00-.4-.4H5.4a.4.4 0 00-.4.4z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const ViewIcon: React.FC <{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#B0A8FF"
          d="M10.962 15.863a1 1 0 01.517-1.931 1.999 1.999 0 002.453-2.453 1 1 0 011.931-.518 3.998 3.998 0 01-1.035 3.867 3.998 3.998 0 01-3.866 1.035z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M12 4c4.937 0 9.055 3.436 10 8-.945 4.564-5.063 8-10 8s-9.055-3.436-10-8c.945-4.564 5.063-8 10-8zm0 14c3.783 0 7.028-2.515 7.946-6-.918-3.485-4.163-6-7.946-6-3.783 0-7.028 2.515-7.946 6 .918 3.485 4.163 6 7.946 6zm1.039-9.863a1 1 0 01-.518 1.931 1.999 1.999 0 00-2.453 2.452 1 1 0 01-1.932.517 3.998 3.998 0 011.036-3.865 3.998 3.998 0 013.867-1.035z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const HideIcon: React.FC <{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#B0A8FF"
          d="M8.558 14.04a4 4 0 015.481-5.481l-1.511 1.511a2.002 2.002 0 00-2.458 2.458L8.558 14.04zm3.078 1.944l4.348-4.348a4 4 0 01-4.347 4.347z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M18.308 4.29a.991.991 0 011.402 1.402L5.692 19.71a.991.991 0 01-1.402-1.402l.88-.879A9.944 9.944 0 012 12c.945-4.564 5.063-8 10-8 1.9 0 3.68.51 5.203 1.396l1.105-1.106zm-2.582 2.582A8.349 8.349 0 0012 6c-3.783 0-7.028 2.515-7.946 6a7.95 7.95 0 002.533 4.012l9.14-9.14zm4.197.825A9.876 9.876 0 0122 12c-.945 4.564-5.063 8-10 8-1.306 0-2.554-.24-3.702-.678l1.59-1.59A8.401 8.401 0 0012 18c3.783 0 7.028-2.515 7.946-6a7.872 7.872 0 00-1.444-2.882l1.42-1.42z"
          className="secondary"
        />
      </g>
    </svg>
  );
};

export const ImageIcon: React.FC <{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#B0A8FF"
          d="M16 11a2 2 0 110-4 2 2 0 010 4z"
          className="primary"
        />
        <path
          fill="#594BC8"
          d="M5 3h14a3 3 0 013 3v12a3 3 0 01-3 3H5a3 3 0 01-3-3V6a3 3 0 013-3zm15 14.343l-2.222-2.222a2 2 0 00-2.828 0l-.629.629 3.25 3.25H19a1 1 0 001-1v-.657zm0-2.828V6a1 1 0 00-1-1H5a1 1 0 00-1 1v5.45l.182-.182a4 4 0 015.657 0l3.068 3.068.629-.629a4 4 0 015.656 0l.808.808zM14.743 19l-6.318-6.318a2 2 0 00-2.829 0L4 14.278V18a1 1 0 001 1h9.743z"
          className="secondary"
        />
      </g>
    </svg>
  );
};
