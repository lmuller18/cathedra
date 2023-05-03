import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

type NextLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode;
  };

interface NavLinkProps extends Omit<NextLinkProps, "className"> {
  className?: (({ isActive }: { isActive: boolean }) => string) | string;
  exact?: boolean;
}

function NavLink(props: NavLinkProps) {
  const { pathname } = useRouter();
  const isActive = props.exact
    ? pathname === props.href.toString()
    : pathname.startsWith(props.href.toString());

  const { className, ...rest } = props;

  let calcedClassName: string | undefined;
  if (typeof className === "function") {
    calcedClassName = className({ isActive });
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    calcedClassName = cn([className, isActive ? "active" : null]);
  }

  return <Link {...rest} className={calcedClassName} />;
}
export default NavLink;
