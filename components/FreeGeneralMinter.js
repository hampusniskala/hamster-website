import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import generalMinterAbi from "../constants/GeneralMinter.json"
import { ConnectButton } from "web3uikit"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Avatar, useNotification, Dropdown, Input, Button } from "web3uikit"
import egyptians_preview from "../images/egyptians_preview.gif"

import styles from "../styles/Home.module.css"

export default function FreeGeneralBox() {
    const { isWeb3Enabled, account, chainId } = useMoralis()

    const [selectedCollection, setSelectedCollection] = useState("")

    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    // General minter
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const generalMinterAddress = "0xF1F51b1755a4cC627764ec62c8D2D2f4Ab765b00"

    async function updateUI() {}

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const { runContractFunction } = useWeb3Contract()

    async function claimFreeMint(_amount, _collection, _vault) {
        console.log("Claiming free mint...")
        _amount = parseInt(_amount)
        let _vaultAddress = "0x0000000000000000000000000000000000000000"
        if (_vault != "") {
            _vaultAddress = _vault
        }

        let _freeMintAddress

        if (_collection == "Bloot") {
            _freeMintAddress = "0x4F8730E0b32B04beaa5757e5aea3aeF970E5B613"
        } else if (_collection == "PVFD") {
            _freeMintAddress = "0xd0A07a76746707f6D6d36D9d5897B14a8e9ED493"
        } else if (_collection == "Legend-X") {
            _freeMintAddress = "0xd433F1601574B2288c32E60cCD2423384fCFd699"
        } else if (_collection == "Kiko Bakes") {
            _freeMintAddress = "0x745735600DCf9562060BEcDAE9A1a0AFfFcd9Cf6"
        } else if (_collection == "Kiko's Mystics") {
            _freeMintAddress = "0xe6D115a05A6483B9969e97553ed23111705AFb57"
        } else if (_collection == "Swaggy Cows") {
            _freeMintAddress = "0x398A5b355658Df4a836c9250FCe6F0A0fC0c9EA0"
            // BasicNft Address on goerli
            //_freeMintAddress = "0xcBb0A6C5Dae791c043efb306fB6b5460Aa25CC71"
        } else if ((_collection = "555 Collective")) {
            _freeMintAddress = "0xe0170203C56Ec5aC0976621408aFc11a6FAD79a8"
        } else {
            _freeMintAddress = ""
        }

        const freeMintOptions = {
            abi: generalMinterAbi,
            contractAddress: generalMinterAddress,
            functionName: "claimFreeMint",
            params: {
                amount: _amount,
                freeMintAddress: _freeMintAddress,
                vaultAddress: _vaultAddress,
            },
        }

        await runContractFunction({
            params: freeMintOptions,
            onSuccess: handleFreeMintSuccess,
            onError: handleFreeMintError,
        })

        async function handleFreeMintSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Thanks for minting!",
                title: "Free NFT(s) has been claimed",
                position: "topR",
            })
        }

        async function handleFreeMintError(tx) {
            dispatch({
                type: "error",
                message: tx.message,
                title: "ERROR: Something went wrong",
                position: "bottomR",
            })
        }
    }

    async function handleCollectionSelect(collection) {
        setSelectedCollection(collection)
    }

    return (
        <div>
            <div>
                {isWeb3Enabled ? (
                    <div className={styles.container}>
                        {/* Free claim starts here */}
                        <div className={styles.center}>
                            <h1 className="py-2 px-4 font-bold text-3xl">
                                Claim your FREE Egyptian Generals
                            </h1>
                            <p className="py-2">
                                Mint an Egyptian General to lead your army in the upcoming
                                blockchain game! If you are a holder of certain NFT collections, you
                                are eligible to mint up to 3 Egyptian Generals for free!
                            </p>

                            <a href="https://app.verdomi.com/">
                                <u className={styles.poppingText}>
                                    Want more? Each extra mint is just $9 over here!
                                </u>
                            </a>

                            <p className="py-2">
                                There are 2,000 Egyptains in total. Of these, 1,000 are male and
                                1,000 are female. There are also two 1/1 Egyptian GODS! (one female
                                and one male) Will you be the lucky owner?
                            </p>
                            <Image src={egyptians_preview} width={488} height={632} />
                            <div className={styles.container}>
                                <div className="py-2">
                                    <Input
                                        id="inputAmount"
                                        label="Amount (1-3)"
                                        placeholder="1"
                                        value="1"
                                        type="number"
                                        key="_amount"
                                        onChange={function noRefCheck() {}}
                                        validation={{
                                            numberMax: 3,
                                            numberMin: 1,
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="py-2">
                                        <p>Select the collection you own</p>
                                        <Dropdown
                                            onChange={(e) => handleCollectionSelect(e.id)}
                                            onComplete={function noRefCheck() {}}
                                            id="inputCollection"
                                            label="Collection: "
                                            options={[
                                                {
                                                    id: "PVFD",
                                                    label: "PVFD",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={1}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gae/ePldXxtnXfJ1UN3cPXLXv0WebbZX_SuWCxn5Ze4hJfhlDWzes1f_uDRjDxAZSL_-rz_yj_1wHiumFmee9C_cwkMT9cTj14JY2Qz1EQ?auto=format&w=1080"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                                {
                                                    id: "Bloot",
                                                    label: "Bloot",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={2}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gae/srjbORK3qPUaMDvBC1EfaMrr3KK1fIg0T6G69QFg-czyTS4wfMm-rP9stVwh4_HyA3QSqMvzc8Ry0NY0OgNClVTaR6dGl6iBTyGMDQ?auto=format&w=3840"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                                {
                                                    id: "Legend-X",
                                                    label: "Legend-X",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={3}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gae/ojwAKtQpc8y0E8P8YS9ziiXTTkILFwMCIXNIRIC0-IFpZW4SFLhl8FUkDq6R2r8cP7cbHylgwgw4HzUMgSdoMQXd7oAVJS_lz8WrRQ0?auto=format&w=1080"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                                {
                                                    id: "Kiko Bakes",
                                                    label: "Kiko Bakes",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={3}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gcs/files/c2a8e25e59b32b60e0865e2abad1eef0.jpg?auto=format&w=1080"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                                {
                                                    id: "Kiko's Mystics",
                                                    label: "Kiko's Mystics",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={3}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gcs/files/b78d14aec8e2a7193bfdcab112db95e8.jpg?auto=format&w=3840"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                                {
                                                    id: "Swaggy Cows",
                                                    label: "Swaggy Cows",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={3}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gae/l2rhqPjWWL9ds_GBJVLddqI3c61Szk_CvzLy8kzUpBkjcF4xugFbNu2CwuF3n8venzvpuNpfP-kNtnspkxiKi2H5TzLcLDtrlQaG?auto=format&w=1080"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                                {
                                                    id: "555 Collective",
                                                    label: "555 Collective",
                                                    prefix: (
                                                        <Avatar
                                                            avatarKey={3}
                                                            borderRadius={7.5}
                                                            fontSize={8}
                                                            size={24}
                                                            image="https://i.seadn.io/gae/idti4SVytDBKujuoa83ZIObY3POXp5uEGtZ9af70EKHIbwiYDpro4OaeORUYq5QjFTc4bSsc_xXokcwc7vRLFnQQhSyHaArNWjMd?auto=format&w=1080"
                                                            theme="image"
                                                        />
                                                    ),
                                                },
                                            ]}
                                        />
                                    </div>
                                    <div className="py-2">
                                        <p>
                                            If using{" "}
                                            <a href="https://delegate.cash/">
                                                <u>delegate.cash</u>
                                            </a>
                                            , enter Vault Address
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <Input
                                            label="Vault Address"
                                            id="inputVault"
                                            name="Test text Input"
                                            placeholder=" "
                                            onBlur={function noRefCheck() {}}
                                            onChange={function noRefCheck() {}}
                                            value=""
                                        />
                                        <p className="text-xs">
                                            If you are holding the NFT from the selected colleciton
                                            in the same wallet that you are minting from, leave this
                                            blank. If you are using a hot wallet that has been
                                            delegated through{" "}
                                            <a href="https://delegate.cash/">
                                                <u>delegate.cash</u>
                                            </a>
                                            {", "}
                                            then you need to enter the address for your vault here.
                                        </p>
                                    </div>

                                    <div className="">
                                        <Button
                                            label="mintButton"
                                            text="Mint"
                                            onClick={() =>
                                                claimFreeMint(
                                                    inputAmount.value,
                                                    selectedCollection,
                                                    inputVault.value
                                                )
                                            }
                                            theme="primary"
                                        />
                                    </div>
                                    <div className="py-16">
                                        <a href="https://app.verdomi.com/">
                                            <u className={styles.poppingText}>
                                                Want more? Each extra mint is just $9 over here!
                                            </u>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* Free claim ends here */}
                        </div>
                    </div>
                ) : (
                    <div>
                        Connect your wallet to get started. <ConnectButton moralisAuth={false} />
                    </div>
                )}
            </div>
        </div>
    )
}
