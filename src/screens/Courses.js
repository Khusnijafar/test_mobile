import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';

import SearchBar from '../components/Searchbar';

var adLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED',
};

const CoursesScreen = ({navigation}) => {
  const SDK_KEY =
    'nLBV8ZmQQ1WNG_qIIqHAU3xEGNZI8aJKHlU3c1t7e9dni2DnDo8BDCzGpn4eiaqOMyv3fRBs3ZoizSRD23UQwo';

  const INTERSTITIAL_AD_UNIT_ID = Platform.select({
    ios: 'f52d5d40fbbdb9fb',
    android: 'f52d5d40fbbdb9fb',
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(
    adLoadState.notLoaded,
  );
  const [interstitialRetryAttempt, setInterstitialRetryAttempt] = useState(0);
  const [statusText, setStatusText] = useState('Initializing SDK...');
  const [categoryData, setCategoryData] = useState([
    {
      id: 1,
      name: 'CSS',
    },
    {
      id: 2,
      name: 'UX',
    },
    {
      id: 3,
      name: 'Swift',
    },
    {
      id: 4,
      name: 'UI',
    },
  ]);
  const [contentData, setContentData] = useState([
    {
      id: 1,
      name: 'UI',
      image: require('../../assets/image-two.png'),
      description: 'Advanced mobile interface design',
      price: '50',
      duration: '3 h 30 min',
    },
    {
      id: 2,
      name: 'UX',
      image: require('../../assets/image-one.png'),
      description: 'Advanced mobile interface design',
      price: '50',
      duration: '3 h 30 min',
    },
  ]);

  AppLovinMAX.setTestDeviceAdvertisingIds([]);
  AppLovinMAX.initialize(SDK_KEY, () => {
    setIsInitialized(true);

    logStatus('SDK Initialized');

    // Attach ad listeners for interstitial ads, rewarded ads, and banner ads
    attachAdListeners();
  });

  function attachAdListeners() {
    // Interstitial Listeners
    AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', adInfo => {
      setInterstitialAdLoadState(adLoadState.loaded);

      // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
      logStatus('Interstitial ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setInterstitialRetryAttempt(0);
    });
    AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', errorInfo => {
      // Interstitial ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setInterstitialRetryAttempt(interstitialRetryAttempt + 1);

      var retryDelay = Math.pow(2, Math.min(6, interstitialRetryAttempt));
      logStatus(
        'Interstitial ad failed to load with code ' +
          errorInfo.code +
          ' - retrying in ' +
          retryDelay +
          's',
      );

      setTimeout(function () {
        AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnInterstitialClickedEvent', adInfo => {
      logStatus('Interstitial ad clicked');
    });
    AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', adInfo => {
      logStatus('Interstitial ad displayed');
    });
    AppLovinMAX.addEventListener(
      'OnInterstitialAdFailedToDisplayEvent',
      adInfo => {
        setInterstitialAdLoadState(adLoadState.notLoaded);
        logStatus('Interstitial ad failed to display');
      },
    );
    AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', adInfo => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad hidden');
    });

    // Banner Ad Listeners
    AppLovinMAX.addEventListener('OnBannerAdLoadedEvent', adInfo => {
      logStatus('Banner ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addEventListener('OnBannerAdLoadFailedEvent', errorInfo => {
      logStatus(
        'Banner ad failed to load with error code ' +
          errorInfo.code +
          ' and message: ' +
          errorInfo.message,
      );
    });
    AppLovinMAX.addEventListener('OnBannerAdClickedEvent', adInfo => {
      logStatus('Banner ad clicked');
    });
    AppLovinMAX.addEventListener('OnBannerAdExpandedEvent', adInfo => {
      logStatus('Banner ad expanded');
    });
    AppLovinMAX.addEventListener('OnBannerAdCollapsedEvent', adInfo => {
      logStatus('Banner ad collapsed');
    });
  }

  function logStatus(status) {
    console.log(status);
    setStatusText(status);
  }

  const openInterstitialAd = () => {
    if (AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID)) {
      AppLovinMAX.showInterstitial(INTERSTITIAL_AD_UNIT_ID);
      setInterstitialAdLoadState(adLoadState.loading);
      AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
    } else {
      logStatus('Loading interstitial ad...');
      setInterstitialAdLoadState(adLoadState.loading);
      AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello,</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.name}>Juana Antonieta</Text>
          <Image
            source={require('../../assets/notif-logo.png')}
            style={styles.notifLogo}
          />
        </View>
        <SearchBar />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.categoryWrapper}>
          <Text style={{color: '#3C3A36', lineHeight: 21}}>Category:</Text>
          {categoryData.map((category, idx) => (
            <View style={styles.category} key={idx}>
              <Text style={styles.categoryText}>#{category.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.contentWrapper}>
          {contentData.map((content, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('DetailCourse'), openInterstitialAd();
              }}
              style={styles.touchableCard}>
              <View
                style={{
                  backgroundColor: '#F8F2EE',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}>
                <Image
                  source={content.image}
                  style={{marginTop: 16, marginBottom: 8}}
                />
                <View style={styles.container}>
                  <View style={styles.priceTextWrapper}>
                    <Text
                      style={{
                        color: '#F2F2F2',
                      }}>
                      $ {content.price}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.container}>
                <Text style={{marginTop: 16, lineHeight: 18, color: '#5BA092'}}>
                  {content.duration}
                </Text>
                <Text style={styles.titleText}>{content.name}</Text>
                <Text
                  style={{marginBottom: 4, lineHeight: 21, color: '#3C3A36'}}>
                  {content.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomWrapper}>
        <View style={styles.insideBottomWrapper}>
          <View style={{flexDirection: 'column'}}>
            <Image
              source={require('../../assets/courses-icon.png')}
              style={{alignSelf: 'center'}}
            />
            <Text style={{color: '#E3562A', marginTop: 8}}>Courses</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Image
              source={require('../../assets/profile-icon.png')}
              style={{alignSelf: 'center'}}
            />
            <Text style={{color: '#BEBAB3', marginTop: 8}}>Profile</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Image
              source={require('../../assets/setting-icon.png')}
              style={{alignSelf: 'center'}}
            />
            <Text style={{color: '#BEBAB3', marginTop: 8}}>Setting</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#3C3A36',
    lineHeight: 26,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 42,
    color: '#333333',
  },
  notifLogo: {
    width: 48,
    height: 48,
    marginTop: -16,
  },
  categoryWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    backgroundColor: '#65AAEA',
    borderRadius: 12,
  },
  contentWrapper: {
    marginTop: 16,
  },
  touchableCard: {
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#BEBAB3',
    borderRadius: 8,
  },
  categoryText: {
    color: '#F2F2F2',
    marginHorizontal: 11,
    marginVertical: 3,
    fontSize: 12,
  },
  titleText: {
    marginTop: 4,
    lineHeight: 32,
    color: '#3C3A36',
    fontSize: 24,
    fontWeight: '500',
  },
  priceTextWrapper: {
    alignSelf: 'flex-end',
    backgroundColor: '#65AAEA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  bottomWrapper: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#BEBAB3',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  insideBottomWrapper: {
    marginHorizontal: 29.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
});
