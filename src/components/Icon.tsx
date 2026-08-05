import {
  ExternalLinkIcon,
  FileTextIcon,
  GithubIcon,
  ImageIcon,
  LinkedinIcon,
  LinkIcon,
  LucideProps,
  MailIcon,
} from "lucide-react";

const icons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
  link: LinkIcon,
  "external-link": ExternalLinkIcon,
  "file-text": FileTextIcon,
  image: ImageIcon,
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};

export default Icon;
