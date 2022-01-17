from django.urls import path, re_path
from todo import views 
 
urlpatterns = [ 
    re_path(r'^api/price/(?P<pk>[0-9]+)$', views.price),
    re_path(r'^api/chart/(?P<category_code>[0-9\-]+)/days$', views.chart_days),
    re_path(r'^api/chart/(?P<category_code>[0-9\-]+)/months$', views.chart_months),
    re_path(r'^api/chart/(?P<category_code>[0-9\-]+)/years$', views.chart_years)
]