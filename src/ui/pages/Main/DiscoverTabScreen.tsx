import {IHistoryItem} from '@/shared/types';
import {Content, Footer, Header, Layout, Text} from '@/ui/components';
import {Row, Col} from 'antd'
import {NavTabBar} from '@/ui/components/NavTabBar';
// import {useInscriptionSummary} from '@/ui/state/accounts/hooks';
import {useSatConfig} from '@/ui/state/config/hooks';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {SAT_API_URL, SAT_IMAGE_CONTENT_PREFIX, SAT_TEXT_CONTENT_PREFIX} from '@/shared/constant';
import {openapiService} from '@/background/service';
import Preview from '@/ui/components/Preview';
import {getWindowSize} from '@/ui/utils';
import {useNavigate} from '@/ui/pages/MainRoute';

// const itemWidth = 120;
const rowNum = 2;
const imageSpan = {xs: 8, sm: 6, md: 4, lg: 3, xl: 3}
const textSpan = {xs: 12, sm: 8, md: 6, lg: 3, xl: 3}
export default function DiscoverTabScreen() {
  // const inscriptionSummary = useInscriptionSummary();
  const navigate = useNavigate();
  const size = useMemo(() => getWindowSize(), [])
  const [imageLimit,textLimit] = useMemo(() => {
    let imgColNum = 8;
    let textColNum = 8;
    switch (size) {
      case 'xs':
        imgColNum = 3;
        textColNum = 2;
        break;
      case 'sm':
        imgColNum = 4;
        textColNum = 3;
        break;
      case 'md':
        imgColNum = 6;
        textColNum = 4;
        break;
      case 'lg':
        imgColNum = 8;
        textColNum = 6;
        break;
      case 'xl':
        imgColNum = 8;
        textColNum = 8;
        break;
      default :
        imgColNum = 8;
        textColNum = 8;
        break;
    }
    return [rowNum * imgColNum,rowNum * textColNum]
  }, [size])
  const config = useSatConfig();
  const [img, setImg] = useState<IHistoryItem[]>([]);
  const getImage = useCallback(async (config) => {
    const contentTypes: string[] = []
    const allTypes = config.contentTypes || [];
    for (let i = 0; i < allTypes.length; i++) {
      if (allTypes[i].startsWith(SAT_IMAGE_CONTENT_PREFIX)) {
        contentTypes.push(allTypes[i])
      }
    }
    if (contentTypes.length > 0) {
      const res = await openapiService.getSatData(contentTypes, 0, imageLimit).then()
      if (res) {
        setImg(res.data || [])
      }
    }
  }, [imageLimit])
  const [text, setText] = useState<IHistoryItem[]>([]);
  const getText = useCallback(async (config) => {
    const contentTypes: string[] = []
    const allTypes = config.contentTypes || [];
    for (let i = 0; i < allTypes.length; i++) {
      if (allTypes[i].startsWith(SAT_TEXT_CONTENT_PREFIX)) {
        contentTypes.push(allTypes[i])
      }
    }
    if (contentTypes.length > 0) {
      const res = await openapiService.getSatData(contentTypes, 0, textLimit).then()
      if (res) {
        setText(res.data || [])
      }
    }
  }, [textLimit])
  useEffect(() => {
    getImage(config).then()
  }, [getImage, config])
  useEffect(() => {
    getText(config).then()
  }, [getText, config])
  return (
    <Layout>
      <Header/>
      <Content  style={{width:'100%',maxWidth:1280,margin:'0 auto'}}>
        <Text text="IMAGE" preset="regular-bold" mt="lg" />

        <Row gutter={[16,16]}>
          {img.map((item, index) => (<Col {...imageSpan} key={`${item}${index}`}>
            <Preview {...item}
              // onClick={() => {
              //   navigate('OrdinalsDetailScreen', { inscription: item.inscribeNum });
              // }}
            />
          </Col>
          ))}
        </Row>
        <Text
          text="More"
          color="orange"
          style={{textAlign:'right'}}
          onClick={() => {
            window.open(SAT_API_URL);
          }}
        />
        <Text text="TEXT" preset="regular-bold" mt="lg" />
        <Row gutter={[16,16]}>
          {text.map((item, index) => (<Col {...textSpan} key={`${item}${index}`}>
            <Preview {...item}
              // onClick={() => {
              //   navigate('OrdinalsDetailScreen', { inscription: item.inscribeNum });
              // }}
            />
          </Col>
          ))}
        </Row>
        <Text
          text="More"
          color="orange"
          style={{textAlign:'right'}}
          onClick={() => {
            window.open(SAT_API_URL);
          }}
        />
      </Content>
      <Footer px="zero" py="zero">
        <NavTabBar tab="mint"/>
      </Footer>
    </Layout>
  );
}
