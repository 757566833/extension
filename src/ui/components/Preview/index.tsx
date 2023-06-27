
import React, {HTMLAttributes, IframeHTMLAttributes, ImgHTMLAttributes, useCallback, useEffect, useState} from 'react';
import {Media, PREVIEW_TYPE} from '@/shared/constant';
import {openapiService} from '@/background/service';
import {IHistoryItem} from '@/shared/types';
import {htmlTransform} from '@/ui/utils';
import {Skeleton, Typography,Card} from 'antd';
import {colors} from '@/ui/theme/colors';

// export  const ImageCard = styled(Card)(()=>({
//   ':hover':{
//     cursor:'pointer'
//   }
// }))
const Text: React.FC<{ value?: string }> = (props) => {
  const { value } = props;
  return <Card hoverable={true} bodyStyle={{padding:0,width:'100%',paddingBottom:'100%',position:'relative',backgroundColor:colors.black_dark}}>
    <Typography style={{position:'absolute',left:12,right:12,top:12,bottom:12}}>
      <Typography.Paragraph>
        {value}
      </Typography.Paragraph>
    </Typography>

  </Card>
}
const Iframe: React.FC<IframeHTMLAttributes<HTMLIFrameElement>> = (props) => {
  const { style, ...others } = props;


  return <Card bodyStyle={{padding:0}}>
    <iframe  {...others} style={{ border: 'none', width: '100%', height: '100%', ...style }} />
  </Card>;
};

const ImagePreview: React.FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const { style, alt = '', ...others } = props;


  return <Card bodyStyle={{padding:0}}>
    <img {...others} alt={alt} style={{ border: 'none', width: '100%', height: '100%', ...style }} />

  </Card>;
};
const getFirstPreByHtmlStr = (html?: string) => {
  const dom = htmlTransform(html)
  return dom?.getElementsByTagName('pre').item(0)?.innerText
}
const getFirstImgByHtmlStr = (html?: string) => {
  const dom = htmlTransform(html)
  return dom?.getElementsByTagName('img').item(0)
}
const Preview: React.FC<Pick<IHistoryItem, 'contentType'|'preview'>&HTMLAttributes<HTMLElement>> = (props) => {
  const { contentType, preview,...others } = props;
  const media: Media = PREVIEW_TYPE[contentType || '']
  const [response, setResponse] = useState('');
  const [isError, setIsError] = useState(false);
  const init = useCallback(async (preview: string) => {
    const res = await openapiService.get(preview);
    if (res) {
      setResponse(res);
    } else {
      setIsError(true)
    }
  }, [])
  useEffect(() => {
    if (preview) {
      init(preview).then()
    }
  }, [init, preview])
  if (isError) {
    return <Text value="404" />
  }
  // return <Card bodyStyle={{padding:0}}>
  //   <Skeleton.Button style={{width:'100%',paddingBottom:'100%'}}  active={true} size={'small'}  block={true} />
  // </Card>
  if (!response) {
    return <Card bodyStyle={{padding:0}}>
      <Skeleton.Button style={{width:'100%',paddingBottom:'100%'}}  active={true} size={'small'}  block={true} />
    </Card>
  }
  switch (media) {
    case Media.Text:{
      const t = getFirstPreByHtmlStr(response);
      return <Text {...others} value={t} />
    }
    case Media.Pdf:
      return <Iframe {...others} src={preview} />
    case Media.Audio:
      return <Iframe {...others} src={preview} />
    case Media.Image:{
      const i = getFirstImgByHtmlStr(response);
      const src = i?.getAttribute('src')
      if (src) {
        if (src.startsWith('http')) {
          return <Iframe {...others} src={preview} />
        } else if (src.startsWith('/')) {
          try {
            const origin = new URL(preview || '').origin
            const url = `${origin}${src}`
            return <ImagePreview {...others} src={url} alt={''} />
          } catch (error) {
            return <Iframe {...others} src={preview} />
          }

        } else {
          // todo
          return <Iframe {...others} src={preview} />
        }
      } else {
        return <Iframe {...others} src={preview} />
      }
    }

    case Media.Iframe:
      return <Iframe {...others} src={preview} />
    case Media.Unknown:
      return <Iframe {...others} src={preview} />
    case Media.Video:
      return <Iframe {...others} src={preview} />
    default:
      return <Iframe {...others} src={preview} />
  }
}

export default Preview;
