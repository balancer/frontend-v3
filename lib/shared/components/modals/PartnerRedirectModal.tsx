/* eslint-disable max-len */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  HStack,
  Image,
  VStack,
  Link,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ArrowUpRight } from 'react-feather'

export enum RedirectPartner {
  Aura = 'aura',
  Beets = 'beets',
  CoW = 'cow',
  Aave = 'aave',
  Gyro = 'gyro',
  Xave = 'xave',
  Cron = 'cron',
  Fjord = 'fjord',
}

type Props = {
  partner: RedirectPartner
  redirectUrl?: string
  isOpen: boolean
  onClose: () => void
}

type PartnerInfo = {
  [key in RedirectPartner]: {
    shortName: string
    fullName: string
    description: string
    url: string
    imageSrc?: string
  }
}

const partnerInfo: PartnerInfo = {
  [RedirectPartner.Aura]: {
    shortName: 'Aura',
    fullName: 'Aura Finance',
    description:
      "Aura Finance is a protocol built on top of the Balancer protocol to provide maximum incentives to Balancer liquidity providers and BAL stakers (into veBAL) through social aggregation of BAL deposits and via additional incentives of Aura's native token.",
    url: 'https://app.aura.finance',
    imageSrc: '/images/partners/aura-header.jpeg',
  },
  [RedirectPartner.Beets]: {
    shortName: 'Beets',
    fullName: 'Beethoven X',
    description:
      'Beethoven X is a community-driven DEX and DeFi power house. Governed by the BEETS token and living on the Fantom Opera and Optimism chains.',
    url: 'https://beets.fi',
  },
  [RedirectPartner.CoW]: {
    shortName: 'CoW',
    fullName: 'CoW Protocol',
    description:
      'CoW Protocol matches trades by executing batch auctions between a variety of on-chain liquidity sources. Trades can be settled with on-chain AMMs directly or with DEX aggregators, depending on which path offers the best price. It is thus, essentially, an aggregator of the DEX aggregators. \n\nIn addition to finding the best prices at any point in time, CoW Protocol can improve prices over what is available elsewhere in the market -- firstly by finding Coincidences of Wants between traders, and secondly by protecting users from having their slippage exploited by MEV bots.',
    url: 'https://cow.fi',
  },
  [RedirectPartner.Aave]: {
    shortName: 'Aave',
    fullName: 'Lend & borrow protocol',
    description:
      'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.',
    url: 'https://aave.com',
  },
  [RedirectPartner.Gyro]: {
    shortName: 'Gyroscope',
    fullName: 'Stablecoin protocol',
    description:
      'Gyroscope is a new stablecoin that, like a physical gyroscope, remains stable as the surrounding environment changes. It is a revolution in stablecoin architecture, risk control and AMM design. Gyroscope is fully-backed, automates monetary policy, and features new AMMs designed for resilient liquidity.',
    url: 'https://gyro.finance',
  },
  [RedirectPartner.Xave]: {
    shortName: 'Xave',
    fullName: 'FX Market Infrastructure',
    description:
      'Xave Finance (pronounced “Save Finance”) builds the on chain infrastructure to enable financial services companies (such as “fintechs” and neobanks) to leverage DeFi for actual use cases, such as real time remittance transfers and high yield consumer savings. Xave does this by building an Forex (FX) accurate AMM via a custom “FXPool” (soon to be upgraded to the “FXMetaPool”) and a stablecoin lending market that shares liquidity with the Balancer V2 Vault. \n\nXave aims to eventually disrupt existing FX services available for overseas money transfers by enabling instant stablecoin trades at FX accurate rates for traders and extremely competitive returns for LPs (especially with our incoming FXMetaPool that pairs non USD stablecoins against the existing Boosted Pool). If done correctly, these fee generating activities will increase stablecoin based yield for LPs, help bring liquid FX markets to DeFi and help the Balancer DAO grow.',
    url: 'https://gyro.finance',
  },
  [RedirectPartner.Cron]: {
    shortName: 'Cron',
    fullName: 'TWAMM for large swaps',
    description:
      'Cron Finance is currently building a Time-Weighted Average Market Maker (TWAMM). The goal of TWAMM functionality is to execute large trades over a period of time in a way that reduces slippage and gas cost for the party executing a swap.',
    url: 'https://app.cronfi.com',
  },
  [RedirectPartner.Fjord]: {
    shortName: 'Fjord Foundry',
    fullName: 'Fair token launches via LBPs',
    description:
      "Fjord (Formerly known as Copper Launch) is a community platform that connects inspired projects with passionate supporters utilizing the power of Liquidity Bootstrapping Pools (LBPs). Fair launch your token and build your community in minutes via Fjord's user friendly platform.",
    url: 'https://fjordfoundry.com',
  },
}

export function PartnerRedirectModal({ partner, redirectUrl, isOpen, onClose }: Props) {
  const info = partnerInfo[partner]

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About {info.shortName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody color="grayText">
          {info.imageSrc && (
            <Image
              src={info.imageSrc}
              alt={info.shortName}
              mb={4}
              shadow="md"
              borderRadius="lg"
              w="full"
            />
          )}
          <VStack align="start" w="full" spacing="lg">
            <VStack align="start" w="full" spacing="none">
              <Text fontSize="xl">{info.fullName}</Text>
              <Link color="grayText" href={info.url} isExternal>
                {info.url}
              </Link>
            </VStack>

            <Text whiteSpace="pre-line">{info.description}</Text>
            <Text>
              Please note, you face additional risks (including smart contract risk) when
              interacting with third party services.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            as={NextLink}
            href={redirectUrl ?? info.url}
            target="_blank"
            variant="primary"
            w="full"
          >
            <HStack>
              <span>Go to {info.shortName}</span>
              <ArrowUpRight size={16} />
            </HStack>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
