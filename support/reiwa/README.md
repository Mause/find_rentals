# REIWA API

- https://reiwa.com.au/templates/searchresults.aspx
- https://restapi.reiwa.com.au/api/listingsearch/getlistingdetails?ListingNo=0
- https://ac.reiwa.com.au/api/Geography
- https://api.reiwa.com.au/

```java
package p093b.p094a.p095a.p096c.p104d.p106b;

import java.util.List;
import java.util.Map;
import kotlin.Metadata;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import p090au.com.reiwa.data.remote.ads.AdvertTargetingResponse;
import p090au.com.reiwa.data.remote.network.ApiResponse;
import p090au.com.reiwa.data.remote.network.ApiResponseV2;
import p090au.com.reiwa.data.remote.network.ApiResponseV3;
import p090au.com.reiwa.data.remote.network.authentication.AuthenticationResponse;
import p090au.com.reiwa.p091ui.agentfinder.profile.agency.emailagency.EmailAgencyRequest;
import p090au.com.reiwa.p091ui.agentfinder.profile.agency.profile.AgencyProfileRequest;
import p090au.com.reiwa.p091ui.agentfinder.profile.agency.profile.AgencyProfileResponse;
import p090au.com.reiwa.p091ui.agentfinder.profile.agent.emailagent.EmailAgentRequest;
import p090au.com.reiwa.p091ui.agentfinder.profile.agent.profile.AgentProfileRequest;
import p090au.com.reiwa.p091ui.agentfinder.profile.agent.profile.AgentProfileResponse;
import p090au.com.reiwa.p091ui.agentfinder.profile.team.TeamProfileRequest;
import p090au.com.reiwa.p091ui.agentfinder.profile.team.TeamProfileResponse;
import p090au.com.reiwa.p091ui.agentfinder.search.model.AgencyAutoCompleteResponse;
import p090au.com.reiwa.p091ui.agentfinder.search.model.AgentAutoCompleteResponse;
import p090au.com.reiwa.p091ui.agentfinder.search.model.AgentFinderSearchRequest;
import p090au.com.reiwa.p091ui.agentfinder.search.model.GeographyAutoCompleteResponse;
import p090au.com.reiwa.p091ui.agentfinder.searchresult.agency.model.AgencySearchResultResponse;
import p090au.com.reiwa.p091ui.agentfinder.searchresult.agent.model.AgentSearchResultResponse;
import p090au.com.reiwa.p091ui.common.model.NewsArticle;
import p090au.com.reiwa.p091ui.common.model.NewsArticleResponse;
import p090au.com.reiwa.p091ui.common.model.SavedProperty;
import p090au.com.reiwa.p091ui.common.model.SavedSearch;
import p090au.com.reiwa.p091ui.common.model.User;
import p090au.com.reiwa.p091ui.home.AppVersionRequest;
import p090au.com.reiwa.p091ui.home.AppVersionResponse;
import p090au.com.reiwa.p091ui.html.HtmlResponse;
import p090au.com.reiwa.p091ui.more.contactus.ContactUsRequest;
import p090au.com.reiwa.p091ui.more.feedback.FeedbackRequest;
import p090au.com.reiwa.p091ui.more.news.newsarticles.NewsArticlesRequest;
import p090au.com.reiwa.p091ui.p092me.homeopenplanner.mapview.model.DirectionsResponse;
import p090au.com.reiwa.p091ui.p092me.myprofile.UpdateProfileRequest;
import p090au.com.reiwa.p091ui.p092me.notification.model.ListingAlert;
import p090au.com.reiwa.p091ui.p092me.notification.model.Notification;
import p090au.com.reiwa.p091ui.p092me.notification.model.UnReadNotificationCount;
import p090au.com.reiwa.p091ui.p092me.recentenquiries.model.RecentEnquiriesResponse;
import p090au.com.reiwa.p091ui.p092me.recentlyviewedproprties.RecentlyViewedProperty;
import p090au.com.reiwa.p091ui.p092me.settings.Settings;
import p090au.com.reiwa.p091ui.propertysearch.bookinspection.BookInspectionRequest;
import p090au.com.reiwa.p091ui.propertysearch.locationsearch.LocationAutoCompleteResponse;
import p090au.com.reiwa.p091ui.propertysearch.propertydetails.model.PropertyDetailsResponse;
import p090au.com.reiwa.p091ui.propertysearch.propertydetails.model.SimilarListingsResponse;
import p090au.com.reiwa.p091ui.propertysearch.propertydetails.model.SuburbProfile;
import p090au.com.reiwa.p091ui.propertysearch.propertydetails.nearbyplaces.NearbyPlacesResponse;
import p090au.com.reiwa.p091ui.propertysearch.searchresult.models.HomeOpenPlan;
import p090au.com.reiwa.p091ui.propertysearch.searchresult.models.PropertySearchRequest;
import p090au.com.reiwa.p091ui.propertysearch.searchresult.models.PropertySearchResponse;
import p090au.com.reiwa.p091ui.propertysearch.searchresult.models.SaveSearchResponse;
import p090au.com.reiwa.tracking.TrackHitRequest;
import p469m.AbstractC7207d;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;
import retrofit2.http.Url;

@Metadata
/* renamed from: b.a.a.c.d.b.e */
/* loaded from: classes.dex */
public interface AbstractC1809e {
    @GET("api/homeopenplanner/getplans")
    @NotNull
    /* renamed from: A */
    AbstractC7207d<ApiResponseV3<List<HomeOpenPlan>>> m20903A();

    @FormUrlEncoded
    @POST("token")
    @NotNull
    /* renamed from: A0 */
    AbstractC7207d<AuthenticationResponse> m20902A0(@Field("grant_type") @NotNull String str, @Field("client-key") @NotNull String str2, @Field("refresh_token") @NotNull String str3);

    @POST("api/homeopenplanner/deleteplan")
    @NotNull
    /* renamed from: B */
    AbstractC7207d<ApiResponseV2> m20901B(@Query("HomeOpenPlanId") int i);

    @POST("api/listingsearch/search")
    @NotNull
    /* renamed from: C */
    AbstractC7207d<ApiResponseV3<PropertySearchResponse>> m20900C(@Body @NotNull PropertySearchRequest propertySearchRequest);

    @FormUrlEncoded
    @POST("api/notifications/register")
    @NotNull
    /* renamed from: D */
    AbstractC7207d<ApiResponseV2> m20899D(@Field("Platform") int i, @Field("Handle") @NotNull String str);

    @FormUrlEncoded
    @POST("api/publicuser/updatepassword")
    @NotNull
    /* renamed from: E */
    AbstractC7207d<ApiResponseV2> m20898E(@Field("OldPassword") @NotNull String str, @Field("NewPassword") @NotNull String str2);

    @POST("api/correspondence/contactagent")
    @NotNull
    /* renamed from: F */
    AbstractC7207d<ApiResponseV2> m20897F(@Body @NotNull EmailAgentRequest emailAgentRequest);

    @POST("api/agentfinder/getagentprofile")
    @NotNull
    /* renamed from: G */
    AbstractC7207d<ApiResponse<AgentProfileResponse>> m20896G(@Body @NotNull AgentProfileRequest agentProfileRequest);

    @FormUrlEncoded
    @POST("api/notifications/deregister")
    @NotNull
    /* renamed from: H */
    AbstractC7207d<ApiResponseV2> m20895H(@Field("Platform") int i, @Field("Handle") @NotNull String str);

    @GET("https://maps.googleapis.com/maps/api/directions/json?")
    @NotNull
    /* renamed from: I */
    AbstractC7207d<DirectionsResponse> m20894I(@QueryMap @NotNull Map<String, String> map);

    @GET("https://maps.googleapis.com/maps/api/place/nearbysearch/json?")
    @NotNull
    /* renamed from: J */
    AbstractC7207d<NearbyPlacesResponse> m20893J(@QueryMap @NotNull Map<String, String> map);

    @GET
    @NotNull
    /* renamed from: K */
    AbstractC7207d<ApiResponseV3<NewsArticle>> m20892K(@Url @NotNull String str, @Query("ContentId") long j);

    @FormUrlEncoded
    @POST("token")
    @NotNull
    /* renamed from: L */
    AbstractC7207d<AuthenticationResponse> m20891L(@Field("grant_type") @NotNull String str, @Field("client-key") @NotNull String str2);

    @GET("api/usersearch/getsavedsearches")
    @NotNull
    /* renamed from: M */
    AbstractC7207d<ApiResponse<List<SavedSearch>>> m20890M();

    @GET
    @NotNull
    /* renamed from: N */
    AbstractC7207d<ApiResponse<LocationAutoCompleteResponse>> m20889N(@Url @NotNull String str, @NotNull @Query("SearchString") String str2, @Query("ListingSearchTypeId") int i);

    @POST("api/agentfinder/getteamprofile")
    @NotNull
    /* renamed from: O */
    AbstractC7207d<ApiResponse<TeamProfileResponse>> m20888O(@Body @NotNull TeamProfileRequest teamProfileRequest);

    @POST("api/publicuser/getenquiries")
    @NotNull
    /* renamed from: P */
    AbstractC7207d<ApiResponse<RecentEnquiriesResponse>> m20887P();

    @FormUrlEncoded
    @POST("api/notifications/markread")
    @NotNull
    /* renamed from: Q */
    AbstractC7207d<ApiResponseV2> m20886Q(@Field("PublicUserNotificationId") int i);

    @FormUrlEncoded
    @POST("api/listingsearch/similarlistings")
    @NotNull
    /* renamed from: R */
    AbstractC7207d<ApiResponse<SimilarListingsResponse>> m20885R(@Field("ListingNo") int i, @Field("ResultsLimit") @Nullable Integer num);

    @POST
    @NotNull
    /* renamed from: S */
    AbstractC7207d<ApiResponseV3<NewsArticleResponse>> m20884S(@Url @NotNull String str, @Body @NotNull NewsArticlesRequest newsArticlesRequest);

    @POST("api/correspondence/submithomenquiry")
    @NotNull
    /* renamed from: T */
    AbstractC7207d<ApiResponseV2> m20883T(@Body @NotNull BookInspectionRequest bookInspectionRequest);

    @FormUrlEncoded
    @POST("api/publicuser/validateToken")
    @NotNull
    /* renamed from: U */
    AbstractC7207d<ApiResponseV2> m20882U(@Field("Token") @NotNull String str);

    @POST("api/correspondence/propertyenquiry")
    @NotNull
    /* renamed from: V */
    AbstractC7207d<ApiResponseV2> m20881V(@Body @NotNull EmailAgentRequest emailAgentRequest);

    @FormUrlEncoded
    @POST("token")
    @NotNull
    /* renamed from: W */
    AbstractC7207d<AuthenticationResponse> m20880W(@Field("grant_type") @NotNull String str, @Field("client-key") @NotNull String str2, @Field("Username") @NotNull String str3, @Field("Password") @NotNull String str4);

    @POST("api/correspondence/contactagency")
    @NotNull
    /* renamed from: X */
    AbstractC7207d<ApiResponseV2> m20879X(@Body @NotNull EmailAgencyRequest emailAgencyRequest);

    @FormUrlEncoded
    @POST("api/publicuser/resetpassword")
    @NotNull
    /* renamed from: Y */
    AbstractC7207d<ApiResponseV2> m20878Y(@Field("EmailAddress") @NotNull String str);

    @POST("api/agentfinder/searchagents")
    @NotNull
    /* renamed from: Z */
    AbstractC7207d<ApiResponse<AgentSearchResultResponse>> m20877Z(@Body @NotNull AgentFinderSearchRequest agentFinderSearchRequest);

    @POST("api/usersearch/deletesavedproperty")
    @NotNull
    /* renamed from: a */
    AbstractC7207d<ApiResponseV2> m20876a(@Query("ListingNo") int i);

    @GET("api/notifications/getnotifications")
    @NotNull
    /* renamed from: a0 */
    AbstractC7207d<ApiResponse<List<Notification>>> m20875a0(@Query("PageNo") int i, @Query("PageSize") int i2);

    @GET("api/agentfinder/agentsautocomplete")
    @NotNull
    /* renamed from: b */
    AbstractC7207d<ApiResponse<AgentAutoCompleteResponse>> m20874b(@NotNull @Query("Search") String str, @Query("MaxCount") int i);

    @FormUrlEncoded
    @POST("api/publicuser/activateaccount")
    @NotNull
    /* renamed from: b0 */
    AbstractC7207d<ApiResponseV2> m20873b0(@Field("Password") @NotNull String str, @Field("Token") @NotNull String str2);

    @POST("api/appversion/checkversion")
    @NotNull
    /* renamed from: c0 */
    AbstractC7207d<ApiResponse<AppVersionResponse>> m20872c0(@Body @NotNull AppVersionRequest appVersionRequest);

    @GET("api/notifications/getunreadcount")
    @NotNull
    /* renamed from: d */
    AbstractC7207d<UnReadNotificationCount> m20871d();

    @POST("api/publicuser/suppress")
    @NotNull
    /* renamed from: d0 */
    AbstractC7207d<ApiResponseV2> m20870d0(@Query("PublicEnquiryId") int i);

    @GET
    @NotNull
    /* renamed from: e0 */
    AbstractC7207d<HtmlResponse> m20869e0(@Url @NotNull String str, @NotNull @Query("ContentId") String str2);

    @POST("api/usersearch/deletesavedsearch")
    @NotNull
    /* renamed from: f */
    AbstractC7207d<ApiResponseV2> m20868f(@Query("SavedSearchId") int i);

    @POST("api/agentfinder/getagencyprofile")
    @NotNull
    /* renamed from: f0 */
    AbstractC7207d<ApiResponse<AgencyProfileResponse>> m20867f0(@Body @NotNull AgencyProfileRequest agencyProfileRequest);

    @POST("api/homeopenplanner/add")
    @NotNull
    /* renamed from: g */
    AbstractC7207d<ApiResponseV3<HomeOpenPlan>> m20866g(@Query("HomeOpenId") int i);

    @POST("api/listingsearch/getadverttargeting")
    @NotNull
    /* renamed from: g0 */
    AbstractC7207d<ApiResponse<AdvertTargetingResponse>> m20865g0(@Body @NotNull PropertySearchRequest propertySearchRequest);

    @GET("api/usersearch/getlistingalert")
    @NotNull
    /* renamed from: h0 */
    AbstractC7207d<ApiResponse<ListingAlert>> m20864h0(@Query("ListingAlertId") int i, @Query("Page") int i2, @Query("PageSize") int i3);

    @POST("api/publicuser/getprofile")
    @NotNull
    /* renamed from: i0 */
    AbstractC7207d<ApiResponse<User>> m20863i0();

    @GET("api/agentfinder/agenciesautocomplete")
    @NotNull
    /* renamed from: j */
    AbstractC7207d<ApiResponse<AgencyAutoCompleteResponse>> m20862j(@NotNull @Query("Search") String str, @Query("MaxCount") int i);

    @FormUrlEncoded
    @POST("api/publicuser/register")
    @NotNull
    /* renamed from: j0 */
    AbstractC7207d<ApiResponseV2> m20861j0(@Field("Email") @NotNull String str, @Field("ReceiveMarketing") boolean z);

    @GET("api/listingsearch/getlistingdetails")
    @NotNull
    /* renamed from: k0 */
    AbstractC7207d<ApiResponseV3<PropertyDetailsResponse>> getListingDetails(@Query("ListingNo") int i);

    @POST("api/usersearch/savesearch")
    @NotNull
    /* renamed from: l0 */
    AbstractC7207d<SaveSearchResponse> m20859l0(@Body @NotNull SavedSearch savedSearch);

    @POST("api/usersearch/saveproperty")
    @NotNull
    /* renamed from: m0 */
    AbstractC7207d<ApiResponseV2> m20858m0(@Query("ListingNo") int i, @Query("ListingAlertFrequencyId") int i2);

    @POST("api/tracking/loghits")
    @NotNull
    /* renamed from: n */
    AbstractC7207d<ApiResponseV2> m20857n(@Body @NotNull TrackHitRequest trackHitRequest);

    @POST("api/agentfinder/searchagencies")
    @NotNull
    /* renamed from: n0 */
    AbstractC7207d<ApiResponse<AgencySearchResultResponse>> m20856n0(@Body @NotNull AgentFinderSearchRequest agentFinderSearchRequest);

    @GET("api/listingsearch/getlistingdetails")
    @NotNull
    /* renamed from: o0 */
    AbstractC7207d<ApiResponse<List<RecentlyViewedProperty>>> m20855o0(@QueryMap @NotNull Map<String, String> map);

    @POST("api/publicuser/updateprofile")
    @NotNull
    /* renamed from: p0 */
    AbstractC7207d<ApiResponse<User>> m20854p0(@Body @NotNull UpdateProfileRequest updateProfileRequest);

    @POST("api/correspondence/contactus")
    @NotNull
    /* renamed from: q0 */
    AbstractC7207d<ApiResponseV2> m20853q0(@Body @NotNull ContactUsRequest contactUsRequest);

    @GET
    @NotNull
    /* renamed from: r0 */
    AbstractC7207d<GeographyAutoCompleteResponse> m20852r0(@Url @NotNull String str, @NotNull @Query("SearchString") String str2, @Query("MaxCount") int i);

    @GET("api/publicuser/getsettings")
    @NotNull
    /* renamed from: s0 */
    AbstractC7207d<ApiResponse<Settings>> getSettings();

    @POST("api/correspondence/contactteam")
    @NotNull
    /* renamed from: t0 */
    AbstractC7207d<ApiResponseV2> contactTeam(@Body @NotNull EmailAgentRequest emailAgentRequest);

    @GET("api/usersearch/getsavedproperties")
    @NotNull
    /* renamed from: u0 */
    AbstractC7207d<ApiResponse<List<SavedProperty>>> getSavedProperties(@Query("page") int i, @Query("pageSize") int i2);

    @POST("api/correspondence/feedback")
    @NotNull
    /* renamed from: v0 */
    AbstractC7207d<ApiResponseV2> m20848v0(@Body @NotNull FeedbackRequest feedbackRequest);

    @GET("api/homeopenplanner/getplan")
    @NotNull
    /* renamed from: w0 */
    AbstractC7207d<ApiResponseV3<HomeOpenPlan>> m20847w0(@Query("HomeOpenPlanId") int i);

    @POST("api/homeopenplanner/deleteplanitem")
    @NotNull
    /* renamed from: x */
    AbstractC7207d<ApiResponseV2> m20846x(@Query("HomeOpenPlanItemId") int i);

    @POST("api/publicuser/savesettings")
    @NotNull
    /* renamed from: x0 */
    AbstractC7207d<ApiResponse<Settings>> m20845x0(@Body @NotNull Settings settings);

    @FormUrlEncoded
    @POST("api/geography/getsuburbprofile")
    @NotNull
    /* renamed from: y */
    AbstractC7207d<ApiResponse<SuburbProfile>> m20844y(@Field("SuburbId") int i);

    @POST("api/correspondence/propertyenquiry")
    @NotNull
    /* renamed from: y0 */
    AbstractC7207d<ApiResponseV2> m20843y0(@Body @NotNull EmailAgencyRequest emailAgencyRequest);

    @POST("api/notifications/deleteall")
    @NotNull
    /* renamed from: z */
    AbstractC7207d<ApiResponseV2> deleteAllNotifications();

    @FormUrlEncoded
    @POST("api/notifications/delete")
    @NotNull
    /* renamed from: z0 */
    AbstractC7207d<ApiResponseV2> deleteNotification(@Field("PublicUserNotificationId") int i);
}
```
