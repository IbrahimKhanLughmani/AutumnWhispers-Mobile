package com.autumnwhispers;
import android.os.Bundle; // here
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // here
public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "AutumnWhispers";
  }
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
}
