import React from 'react'
import { createLink, LinkComponent } from '@tanstack/react-router'
import {
  Link as GravityLink,
  LinkProps as GravityLinkProps
} from '@gravity-ui/uikit'

interface GravitySpecificProps
  extends Omit<
    GravityLinkProps,
    | 'href' // Исключаем href (будет от роутера)
    | 'style' // Исключаем style (добавим свой)
    | 'ref' // Исключаем ref (обрабатывается forwardRef)
    | 'children' // Исключаем children (добавим свой)
    | 'onClick' // Исключаем onClick (будет от роутера)
    | 'target' // Исключаем target (будет от роутера)
  > {
  style?: React.CSSProperties // Добавляем style явно
  children?: React.ReactNode // Добавляем children явно
  className?: string // Добавляем className явно (он есть и в React.HTMLAttributes, и часто в UI-китах)
}

interface GravityLinkAdapterProps
  extends GravitySpecificProps,
    Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick' | 'target'> {
  href: string
}

const GravityLinkAdapter = React.forwardRef<
  HTMLAnchorElement,
  GravityLinkAdapterProps
>((props, ref) => {
  const { href, onClick, target, ...gravitySpecificProps } = props

  return (
    <GravityLink
      ref={ref}
      href={href}
      onClick={onClick}
      target={target}
      {...gravitySpecificProps}
    />
  )
})

const CreatedRouterLink = createLink(GravityLinkAdapter)

export const CustomLink: LinkComponent<typeof GravityLinkAdapter> = (props) => {
  return <CreatedRouterLink preload='intent' {...props} />
}

GravityLinkAdapter.displayName = 'GravityLinkAdapter'
;(CustomLink as React.FC<any>).displayName = 'CustomLink'
