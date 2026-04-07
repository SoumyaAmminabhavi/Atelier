import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const Icon = ({ name, className, style }: { name: string } & IconProps) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>
    {name}
  </span>
);

export const Menu = (props: IconProps) => <Icon name="menu" {...props} />;
export const ShoppingBag = (props: IconProps) => <Icon name="shopping_bag" {...props} />;
export const Home = (props: IconProps) => <Icon name="home" {...props} />;
export const BrandAwareness = (props: IconProps) => <Icon name="brand_awareness" {...props} />;
export const Person = (props: IconProps) => <Icon name="person" {...props} />;
export const ArrowBack = (props: IconProps) => <Icon name="arrow_back" {...props} />;
export const ArrowForward = (props: IconProps) => <Icon name="arrow_forward" {...props} />;
export const Remove = (props: IconProps) => <Icon name="remove" {...props} />;
export const Add = (props: IconProps) => <Icon name="add" {...props} />;
export const Apple = (props: IconProps) => <Icon name="apple" {...props} />;
export const CreditCard = (props: IconProps) => <Icon name="credit_card" {...props} />;
export const Lock = (props: IconProps) => <Icon name="lock" {...props} />;
export const East = (props: IconProps) => <Icon name="east" {...props} />;
export const FormatQuote = (props: IconProps) => <Icon name="format_quote" {...props} />;
export const PlayArrow = (props: IconProps) => <Icon name="play_arrow" {...props} />;
export const Spa = (props: IconProps) => <Icon name="spa" {...props} />;
export const Fingerprint = (props: IconProps) => <Icon name="fingerprint" {...props} />;
export const Mail = (props: IconProps) => <Icon name="mail" {...props} />;
export const AutoAwesome = (props: IconProps) => <Icon name="auto_awesome" {...props} />;
export const AddCircle = (props: IconProps) => <Icon name="add_circle" {...props} />;
export const CalendarToday = (props: IconProps) => <Icon name="calendar_today" {...props} />;
export const Label = (props: IconProps) => <Icon name="label" {...props} />;
export const PublishedWithChanges = (props: IconProps) => <Icon name="published_with_changes" {...props} />;
export const Google = (props: IconProps) => <Icon name="google" {...props} />;
export const IOS = (props: IconProps) => <Icon name="ios" {...props} />;
export const ImageEdit = (props: IconProps) => <Icon name="image_edit" {...props} />;
export const AutoFixHigh = (props: IconProps) => <Icon name="auto_fix_high" {...props} />;
export const Download = (props: IconProps) => <Icon name="download" {...props} />;
export const Close = (props: IconProps) => <Icon name="close" {...props} />;
export const Send = (props: IconProps) => <Icon name="send" {...props} />;
export const Visibility = (props: IconProps) => <Icon name="visibility" {...props} />;
export const VisibilityOff = (props: IconProps) => <Icon name="visibility_off" {...props} />;
