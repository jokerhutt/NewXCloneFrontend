import FollowersFollowing from "../../user/FollowersFollowing.tsx";
import ProfilePic from "../../user/ProfilePic.tsx";
import DrawerNavigationPair from "./DrawerNavigationPair.tsx";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useCurrentUser } from "../../../context/Auth/CurrentUserProvider.tsx";
import UsernameComponent from "../../user/UsernameComponent.tsx";
import DisplayNameComponent from "../../user/DisplayNameComponent.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useModal } from "../../../context/GlobalState/ModalProvider.tsx";
import { HeroIcon } from "../../ui/HeroIcon.tsx";

type MobileMainDrawerProps = {
    setDrawerOpen:Dispatch<SetStateAction<boolean>>
}

function MobileMainDrawer ( {setDrawerOpen}: MobileMainDrawerProps ) {

    const location = useLocation();
    const {setModalType} = useModal();
    const {currentUser} = useCurrentUser();
    const drawerVariant = {
        initial: { x: "-100%", opacity: 0 },
        animate: {
          x: -8,
          opacity: 1,
          transition: { type: "spring", stiffness: 250, damping: 25 }
        },
        exit: {
          x: "-100%",
          opacity: 0,
          transition: { duration: 0.3, ease: "easeInOut" }
        }
      };
    const navigate = useNavigate();

    useEffect(() => {
        console.log("curriser " + JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <motion.div
        className="absolute will-change-transform z-8 top-0 w-full h-full backdrop-blur-sm"
        variants={drawerVariant}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={() => setDrawerOpen(false)}>

            <div
            onClick={(e) => e.stopPropagation()}
            className="w-2/3 min-w-[280px] max-w-2/3 p-4 pl-6 border-r flex flex-col border-twitterBorder h-full bg-(--background-main)">
                
                <div className="w-full h-fit ">
                    <div onClick={() => navigate(`/profile/${currentUser?.id}`)} className="w-12 h-12">
                        <ProfilePic userId={currentUser?.id}/>
                    </div>
                    <div className="text-twitterTextAlt">
                        <div className="text-twitterText text-xl font-bold">
                            <DisplayNameComponent user={currentUser}/>
                        </div>
                    <UsernameComponent user={currentUser}/>
                    </div>

                    <div className="flex gap-4 mt-2">
                        {currentUser && (
                            <FollowersFollowing pageUser={currentUser}/>
                        )}
                    </div>

                </div>

                <div className="flex w-full h-fit flex-col py-2">

                    <DrawerNavigationPair name={"Home"} routePath="/" setDrawerOpen={setDrawerOpen}>
                        <HeroIcon iconName="HomeIcon" className="h-7 w-7" solid={location.pathname === `/`}/>
                    </DrawerNavigationPair>

                    <DrawerNavigationPair name={"Profile"} routePath={`/profile/${currentUser?.id}`} setDrawerOpen={setDrawerOpen}>
                        <HeroIcon iconName="UserIcon" className="h-7 w-7" solid={location.pathname === `/profile/${currentUser?.id}`}/>
                    </DrawerNavigationPair>

                    <DrawerNavigationPair name={"Notifications"} routePath="/notifications" setDrawerOpen={setDrawerOpen}>
                        <HeroIcon iconName="BellIcon" className="h-7 w-7" solid={location.pathname === `/notifications`}/>
                    </DrawerNavigationPair>

                    <DrawerNavigationPair name={"Bookmarks"} routePath="/bookmarks" setDrawerOpen={setDrawerOpen}>
                        <HeroIcon iconName="BookmarkIcon" className="h-7 w-7" solid={location.pathname === `/bookmarks`}/>
                    </DrawerNavigationPair>

                    <DrawerNavigationPair name={"About"} routePath="/about" setDrawerOpen={setDrawerOpen}>
                        <HeroIcon iconName="QuestionMarkCircleIcon" className="h-7 w-7" solid={false}/>
                    </DrawerNavigationPair>

                    <div onClick={() => setModalType("changeColor")}>
                        <DrawerNavigationPair name={"Set Theme"} >
                        <HeroIcon iconName="PaintBrushIcon" className="h-7 w-7" solid={false}/>
                        </DrawerNavigationPair>
                    </div>

                    <DrawerNavigationPair name={"Log Out"} setDrawerOpen={setDrawerOpen}>
                        <HeroIcon iconName="PowerIcon" className="h-7 w-7" solid={false}/>
                    </DrawerNavigationPair>

                </div>



            </div>

        </motion.div>
    )

}

export default MobileMainDrawer;