REM 不要なプラグインのtype文をREMでコメントアウト後、本BATを起動してください
REM
REM 例）jquery.keep-positionが不要な場合
REM     REM ..\src\jquery.keep-position.js >> jquery.sitekit-custom.js

type nul > jquery.sitekit-custom.css
type nul > jquery.sitekit-custom.js


REM jquery.external
type ..\src\jquery.external.css >> jquery.sitekit-custom.css
type ..\src\jquery.external.js  >> jquery.sitekit-custom.js


REM jquery.google-custom-search
type ..\src\jquery.google-custom-search.css >> jquery.sitekit-custom.css
type ..\src\jquery.google-custom-search.js  >> jquery.sitekit-custom.js


REM jquery.go-top
type ..\src\jquery.go-top.css >> jquery.sitekit-custom.css
type ..\src\jquery.go-top.js  >> jquery.sitekit-custom.js


REM jquery.hatebu-users
type ..\src\jquery.hatebu-users.css >> jquery.sitekit-custom.css
type ..\src\jquery.hatebu-users.js  >> jquery.sitekit-custom.js


REM jquery.keep-position
type ..\src\jquery.keep-position.js >> jquery.sitekit-custom.js


REM jquery.social-buttons
type ..\src\jquery.social-buttons.css >> jquery.sitekit-custom.css
type ..\src\jquery.social-buttons.js  >> jquery.sitekit-custom.js


