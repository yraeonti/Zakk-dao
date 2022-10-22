import type { NextPage } from 'next'
import {useEffect} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { formatEther } from "ethers/lib/utils";
import {useProviderContext} from '../context/Web3Context'
import CreateProposalTab from '../components/CreateProposalTab';
import ViewProposalTab from '../components/ViewProposalTab';

const Home: NextPage = () => {

 const {nftBalance, treasuryBalance, numProposals, setSelectedTab, selectedTab, fetchAllProposals} = useProviderContext()
 


  const renderTabs = () => {
    if(selectedTab === "Create Proposals") {
      return <CreateProposalTab/>
    }else if (selectedTab === "View Proposals") {
      return <ViewProposalTab/>
    }
    return null
  }

  useEffect(() => {
    if (selectedTab === "View Proposals") {
        fetchAllProposals();
      }
}, [selectedTab])

  return (
    <div>
      <Head>
        <title>Zakk DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Zakk Dao!</h1>
          <div className={styles.description}>Welcome to the DAO!</div>
          <div className={styles.description}>
            Your CryptoDevs NFT Balance: {nftBalance}
            <br />
            Treasury Balance: {formatEther(treasuryBalance)} ETH
            <br />
            Total Number of Proposals: {numProposals}
          </div>
          <div className={styles.flex}>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("Create Proposals")}
            >
              Create Proposal
            </button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("View Proposals")}
            >
              View Proposals
            </button>
          </div>
          {renderTabs()}
        </div>
        <div>
          <img className={styles.image} src="/cryptodevs/novatar.jpg"/>
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Zakk
      </footer>
    </div>
  )
}

export default Home
