import { ConnectButton } from "web3uikit"
import Link from "next/link"
import Image from "next/image"
import verdomi_text from "../images/verdomi_text.png"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            {/*  <h1 className="py-4 px-4 font-bold text-3xl">Verdomi</h1> */}
            <Image src={verdomi_text} width={546 / 2} height={92 / 2} />
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/claim-og-achievement">
                    <a className="mr-4 p-6">Claim OG Achievement</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
