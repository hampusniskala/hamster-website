import AchievementBox from "../components/AchievementBox"

export default function Home() {
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Achievements to collect:</h1>
            <div className="flex flex-wrap">
                {(() => {
                    const achievements = []

                    for (let i = 0; i <= 1; i++) {
                        achievements.push(<AchievementBox tokenId={i} key={i} />)
                    }

                    return achievements
                })()}
            </div>
        </div>
    )
}
