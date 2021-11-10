import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';

import Header from '../components/Header';

var adLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED',
};

export type Props = {
  navigation: any;
};

const DetailCourseScreen: React.FC<Props> = ({navigation}) => {
  const SDK_KEY =
    'nLBV8ZmQQ1WNG_qIIqHAU3xEGNZI8aJKHlU3c1t7e9dni2DnDo8BDCzGpn4eiaqOMyv3fRBs3ZoizSRD23UQwo';

  const INTERSTITIAL_AD_UNIT_ID = Platform.select({
    ios: 'f52d5d40fbbdb9fb',
    android: 'f52d5d40fbbdb9fb',
  });

  const BANNER_AD_UNIT_ID = Platform.select({
    ios: 'a65b5166d42eb1b0',
    android: 'a65b5166d42eb1b0',
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(
    adLoadState.notLoaded,
  );
  const [interstitialRetryAttempt, setInterstitialRetryAttempt] = useState(0);
  const [statusText, setStatusText] = useState('Initializing SDK...');

  AppLovinMAX.setTestDeviceAdvertisingIds([]);
  AppLovinMAX.initialize(SDK_KEY, () => {
    setIsInitialized(true);

    logStatus('SDK Initialized');

    // Attach ad listeners for interstitial ads, rewarded ads, and banner ads
    attachAdListeners();
  });

  function attachAdListeners() {
    // Interstitial Listeners
    AppLovinMAX.addEventListener(
      'OnInterstitialLoadedEvent',
      (adInfo: {networkName: string}) => {
        setInterstitialAdLoadState(adLoadState.loaded);

        // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
        logStatus('Interstitial ad loaded from ' + adInfo.networkName);

        // Reset retry attempt
        setInterstitialRetryAttempt(0);
      },
    );
    AppLovinMAX.addEventListener(
      'OnInterstitialLoadFailedEvent',
      (errorInfo: {code: string}) => {
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
      },
    );
    AppLovinMAX.addEventListener('OnInterstitialClickedEvent', () => {
      logStatus('Interstitial ad clicked');
    });
    AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', () => {
      logStatus('Interstitial ad displayed');
    });
    AppLovinMAX.addEventListener('OnInterstitialAdFailedToDisplayEvent', () => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad failed to display');
    });
    AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', () => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad hidden');
    });

    // Banner Ad Listeners
    AppLovinMAX.addEventListener(
      'OnBannerAdLoadedEvent',
      (adInfo: {networkName: string}) => {
        logStatus('Banner ad loaded from ' + adInfo.networkName);
      },
    );
    AppLovinMAX.addEventListener(
      'OnBannerAdLoadFailedEvent',
      (errorInfo: {code: string; message: string}) => {
        logStatus(
          'Banner ad failed to load with error code ' +
            errorInfo.code +
            ' and message: ' +
            errorInfo.message,
        );
      },
    );
    AppLovinMAX.addEventListener('OnBannerAdClickedEvent', () => {
      logStatus('Banner ad clicked');
    });
    AppLovinMAX.addEventListener('OnBannerAdExpandedEvent', () => {
      logStatus('Banner ad expanded');
    });
    AppLovinMAX.addEventListener('OnBannerAdCollapsedEvent', () => {
      logStatus('Banner ad collapsed');
    });
  }

  function logStatus(status: string) {
    console.log(status);
    setStatusText(status);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style={styles.container}>
        <Header onPress={() => navigation.pop()} label="HTML" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.headerText}>Tags For Headers</Text>
        <Text style={styles.textLesson}>3 of 11 lessons</Text>
        <View style={styles.menuWrapper}>
          <View style={styles.textLessonWrapper}>
            <Text style={styles.textMenu}>Lessons</Text>
          </View>
          <View style={styles.textTestsWrapper}>
            <Text style={styles.textMenu}>Tests</Text>
          </View>
          <View style={styles.textDiscussWrapper}>
            <Text style={styles.textMenu}>Discuss</Text>
          </View>
        </View>
        <View style={{marginTop: 16}}>
          <TouchableOpacity
            style={{backgroundColor: '#E6EDF4', borderRadius: 8}}
            onPress={() => {
              if (AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID)) {
                AppLovinMAX.showInterstitial(INTERSTITIAL_AD_UNIT_ID);
              } else {
                logStatus('Loading interstitial ad...');
                setInterstitialAdLoadState(adLoadState.loading);
                AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
              }
            }}>
            <Image
              source={require('../../assets/image-three.png')}
              style={styles.image}
            />
            <Image
              source={require('../../assets/play-icon.png')}
              style={styles.iconPlay}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 24}}>
          <Text style={styles.textTitle}>Introduction</Text>
          <Text style={styles.textDescription}>
            You can launch a new career in web development today by learning
            HTML & CSS. You don't need a computer science degree or expensive
            software. All you need is a computer, a bit of time, a lot of
            determination, and a teacher you trust. Once the form data has been
            validated on the client-side, it is okay to submit the form. And,
            since we covered validation in the previous article, we're ready to
            submit! This article looks at what happens when a user submits a
            form — where does the data go, and how do we handle it when it gets
            there? We also look at some of the security concerns.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.container}>
        <AppLovinMAX.AdView
          adUnitId={BANNER_AD_UNIT_ID}
          adFormat={AppLovinMAX.AdFormat.BANNER}
          style={styles.banner}
        />
      </View>
    </SafeAreaView>
  );
};

export default DetailCourseScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  headerText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 24,
    lineHeight: 32,
    color: '#3C3A36',
    fontWeight: '600',
  },
  textLesson: {
    textAlign: 'center',
    marginTop: 8,
    color: '#78746D',
    lineHeight: 21,
  },
  menuWrapper: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  textLessonWrapper: {
    backgroundColor: '#F8F2EE',
    width: 114,
    height: 42,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  textMenu: {
    textAlign: 'center',
    marginVertical: 8,
    lineHeight: 26,
    color: '#3C3A36',
  },
  textTestsWrapper: {backgroundColor: '#F8F2EE', width: 114, height: 42},
  textDiscussWrapper: {
    backgroundColor: '#F8F2EE',
    width: 114,
    height: 42,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  iconPlay: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    marginRight: 8,
    marginBottom: 8,
  },
  textTitle: {
    color: '#3C3A36',
    fontWeight: '600',
    lineHeight: 26,
    fontSize: 20,
  },
  textDescription: {
    marginTop: 4,
    color: '#78746D',
    lineHeight: 21,
  },
  banner: {
    // Set background color for banners to be fully functional
    backgroundColor: '#000000',
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: AppLovinMAX.getAdaptiveBannerHeightForWidth(-1),
    bottom: Platform.select({
      ios: 36, // For bottom safe area
      android: 0,
    }),
  },
});
