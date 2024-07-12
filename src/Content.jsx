import { IntlProvider } from 'react-intl';
import messages from './messages';
import { useLocale } from './contexts/LocaleContext';
import Header from './components/Header';
import View from './components/View';

const Content = () => {
  const { locale } = useLocale();

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <Header />
      <View />
    </IntlProvider>
  );
};

export default Content;
