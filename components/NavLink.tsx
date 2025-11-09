import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, ...props }, ref) => {
    const { asPath } = useRouter(); // Get the current path

    const isActive = asPath === href; // Check if current path matches the link href

    // We directly concatenate classNames with conditions
    const linkClassName = cn(className, isActive && activeClassName);

    return (
      <Link href={href} passHref>
        <a ref={ref} className={linkClassName} {...props} />
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
