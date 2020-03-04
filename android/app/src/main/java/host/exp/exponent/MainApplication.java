package host.exp.exponent;

import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.facebook.react.ReactPackage;
import com.theoremreach.RNTheoremReachPackage;
import org.unimodules.core.interfaces.Package;

import java.util.Arrays;
import java.util.List;

import co.squaretwo.pollfish.RNPollfishPackage;
import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import host.exp.exponent.generated.BasePackageList;
import okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import com.kochava.reactlibrary.RNKochavaTrackerPackage;
import info.applike.advertisingid.RNAdvertisingIdPackage;
import com.bebnev.RNUserAgentPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.reactlibrary.RNAdColonyPackage;

public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!

        // Needed for `react-native link`
        // new MainReactPackage(),
            new RNKochavaTrackerPackage(),
            new RNAdvertisingIdPackage(),
            new RNUserAgentPackage(),
            new RNVersionNumberPackage(),
            new RNAdColonyPackage(),
            new RNTheoremReachPackage(),
            new SnackbarPackage(),
            new RNPollfishPackage()
    );
  }

  public List<Package> getExpoPackages() {
    return new BasePackageList().getPackageList();
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
}
