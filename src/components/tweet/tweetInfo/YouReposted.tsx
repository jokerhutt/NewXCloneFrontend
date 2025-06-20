import { HeroIcon } from "../../ui/HeroIcon.tsx";

type YouRepostedProps = {
    reposterId?: number;
}

export function YouReposted ({reposterId} : YouRepostedProps) {
    return (
    <>
        <div className="flex h-6 mb-0.5 col-start-2 items-center gap-2 text-twitterTextAlt w-full">
        <HeroIcon iconName="ArrowPathRoundedSquareIcon" className="h-4 w-4"/>
        <p className="text-sm">You reposted</p>
        </div>
    </>    
    )
}