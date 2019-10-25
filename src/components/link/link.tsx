import cc from 'classcat';
import React from 'react';
import { useLocation } from 'react-router';
import { Link, NavLinkProps } from 'react-router-dom';

const CustomLink: React.FC<NavLinkProps> = (props) => {
  const location = useLocation();
  const { exact, activeClassName, ...childProps } = props;

  console.log({ location});

  const currentPath: string = typeof props.to === 'string'
    ? props.to
    : (props.to as any).pathname;

  childProps.className = cc([
    childProps.className,
    {
      [activeClassName as string]: exact
        ? (location.pathname === currentPath)
        : (location.pathname.startsWith(currentPath)),
    },
  ]);

  return <Link {...childProps} />;
};

export default CustomLink;
