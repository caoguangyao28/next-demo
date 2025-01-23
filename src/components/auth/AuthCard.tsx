import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Socials from "@/components/auth/Socials";
import BackButton from "@/components/auth/BackButton";


type CardWrapperProps = {
  children: React.ReactNode;
  cardTile: string;
  backButtonHref: string;
  backButtonLable: string;
  showSocials?: boolean;
};

export default function AuthCard({
  children,
  cardTile,
  backButtonHref,
  backButtonLable,
  showSocials,
}: CardWrapperProps) {
  return (
    <Card className={'w-1/2'}>
      <CardHeader>
        <CardTitle>{cardTile}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLable} />
      </CardFooter>
    </Card>
  )
}
