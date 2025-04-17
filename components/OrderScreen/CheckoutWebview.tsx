import { WebView } from "react-native-webview";

type Props = {
  checkoutUrl: string;
};
export default function CheckoutWebview({ checkoutUrl }: Props) {
  return <WebView source={{ uri: checkoutUrl }} style={{ flex: 1 }} />;
}
