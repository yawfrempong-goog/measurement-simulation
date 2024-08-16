(()=>{var e={32:e=>{const t=/^[0-9]+$/,r=/^-?[0-9]+$/,i=/^[0-9a-fA-F]+$/,n=/^[a-zA-Z0-9-_]+$/;function a(e){return null===e?"null":"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e?"string":Array.isArray(e)?"array":null!==e&&"object"==typeof e&&e.constructor===Object?"object":""}function o(e,r,i){return i=void 0===i?"":u(i,"'"),e="number"===a(e)?String(e):e,t.test(e)?!(BigInt(e)>2n**64n-1n&&(r.error(i+"must fit in an unsigned 64-bit integer"),1)):(r.error(i+`must be an uint64 (must match ${t})`),!1)}function s(e,t,i){return i=void 0===i?"":u(i,"'"),e="number"===a(e)?String(e):e,r.test(e)?!(BigInt(e)<(-2n)**(32n-1n)||BigInt(e)>2n**(32n-1n)-1n)||(t.error(i+"must fit in a signed 32-bit integer"),!1):(t.error(i+`must be an int32 (must match ${r})`),!1)}function l(e,t,i){return i=void 0===i?"":u(i,"'"),e="number"===a(e)?String(e):e,r.test(e)?!(BigInt(e)<(-2n)**(64n-1n)||BigInt(e)>2n**(64n-1n)-1n)||(t.error(i+"must fit in a signed 64-bit integer"),!1):(t.error(i+`must be an int64 (must match ${r})`),!1)}function u(e,t){return""===e?e:((e=e.trim()).startsWith(t)||(e=t+e),e.endsWith(t)||(e+=t),e+" ")}function g(e,t){try{return new URL(e)}catch(e){t.error("invalid URL format")}}function _(e,t,r,i){if(i=void 0===i?"":u(i,"'"),t.length>r.flags.max_filter_maps_per_filter_set)e.error(i+"array length exceeds the max filter maps per filter set limit");else for(let n=0;n<t.length;n++)if(d(e,t[n],r,i),e.errors.length>0)return}function d(e,t,r,i){if(i=void 0===i?"":u(i,"'"),Object.keys(t).length>r.flags.max_attribution_filters)e.error(i+"exceeded max attribution filters");else for(key in t){if(keyString=u(key,"'"),r.flags.should_check_filter_size&&new Blob([key]).size>r.flags.max_bytes_per_attribution_filter_string)return void e.error(keyString+"exceeded max bytes per attribution filter string");if("_lookback_window"===key&&r.flags["feature-lookback-window-filter"]){if(!r.flags.can_include_lookback_window)return void e.error(i+"filter: _lookback_window is not allowed");if(!l(t[key],e,key))return;if(Number(t[key])<0)return void e.error("lookback_window must be a positive number");t[key]=t[key]}else{if(key.startsWith("_"))return void e.error(keyString+"filter can not start with underscore");if(filterValues=t[key],"array"!==a(filterValues))return void e.error(keyString+"filter value must be an array");if(filterValues.length>r.flags.max_values_per_attribution_filter)return void e.error(keyString+"exceeded max values per attribution filter");for(let t=0;t<filterValues.length;t++){let i=filterValues[t];if("string"!==a(i))return void e.error(keyString+"filter values must be strings");if(new Blob([i]).size>r.flags.max_bytes_per_attribution_filter_string)return void e.error(u(i,"'")+"exceeded max bytes per attribution filter value string")}}}}function c(e,t,r){for(key in t){let i=u(key,"'");if("_lookback_window"===key&&r.flags["feature-lookback-window-filter"]){if("null"===a(t[key]))return void e.error(i+"must be a string or able to cast to string");if(!l(String(t[key]),e,key))return;t[key]=Number(t[key])}else{if("array"!==a(t[key]))return void e.error(i+"filter value must be an array");let r=t[key];for(let t=0;t<r.length;t++){let n=r[t];if("null"===a(n))return void e.error(i+"filter values must be string or able to cast to string");r[t]=String(n)}t[key]=r}}}function f(e,t,r,i){i=void 0===i?"":u(i,"'"),null!==t&&""!==t?new Blob([t]).size>r.flags.max_bytes_per_attribution_aggregate_key_id&&e.error(i+"exceeded max bytes per attribution aggregate key id string"):e.error(i+"null or empty aggregate key string")}function b(e,t,r){if(null===t||""===t)return void e.error("key piece value must not be null or empty string");if(!t.startsWith("0x")&&!t.startsWith("0X"))return void e.error("key piece value must start with '0x' or '0X'");let n=new Blob([t]).size;n<r.flags.min_bytes_per_aggregate_value||n>r.flags.max_bytes_per_aggregate_value?e.error("key piece value string size must be in the byte range (3 bytes - 34 bytes)"):t.substring(2).match(i)||e.error("key piece values must be hexadecimal")}function p(e,t,r,i){r.flags.can_include_lookback_window=!0,r.flags.should_check_filter_size=!r.flags["feature-enable-update-trigger-header-limit"];let n=y(t,e);e.errors.length>0||(_(e,n,r),e.errors.length>0||(r.expected_value[i]=JSON.stringify(n)))}function y(e,t,r){if(r=void 0===r?"":u(r,"'"),"array"===a(e)||"object"===a(e)){if("array"===a(e))for(let i=0;i<e.length;i++)if("object"!==a(e[i]))return void t.error(r+"must be an array of object(s)");return"object"===a(e)?[e]:e}t.error(r+"must be an object or an array")}e.exports={State:class{constructor(){this.path=[],this.errors=[],this.warnings=[]}error(e){this.errors.push({path:[...this.path],msg:e,formattedError:`${e}: \`${[...this.path]}\``})}warning(e){this.warnings.push({path:[...this.path],msg:e,formattedWarning:`${e}: \`${[...this.path]}\``})}scope(e,t){this.path.push(e),t(),this.path.pop()}result(){return{errors:this.errors,warnings:this.warnings}}validate(e,t){Object.entries(t).forEach((([t,r])=>{this.scope(t,(()=>r(this,t,e)))}))}},boolean:function(e=(()=>{}),t){return(r,i)=>{"boolean"!==a(i)?r.error("must be a boolean"):result=void 0===t?e(r,i):e(r,i,t)}},optBoolean:function(e=(()=>{}),t){return(r,i)=>{if("boolean"!==a(i)){if("string"===a(i)){if("true"===i.toLowerCase())return void(result=void 0===t?e(r,!0):e(r,!0,t));if("false"===i.toLowerCase())return void(result=void 0===t?e(r,!1):e(r,!1,t))}r.error("must be a boolean")}else result=void 0===t?e(r,i):e(r,i,t)}},optBooleanFallback:function(e=(()=>{}),t){return(r,i)=>{if("boolean"!==a(i)){if("string"===a(i)){if("true"===i)return void(result=void 0===t?e(r,!0):e(r,!0,t));if("false"===i)return void(result=void 0===t?e(r,!1):e(r,!1,t))}result=void 0===t?e(r,!1):e(r,!1,t)}else result=void 0===t?e(r,i):e(r,i,t)}},uint64:function(e=(()=>{}),r){return(i,n)=>{t.test(n)?BigInt(n)>2n**64n-1n?i.error("must fit in an unsigned 64-bit integer"):result=void 0===r?e(i,Number(n)):e(i,Number(n),r):i.error(`must be an uint64 (must match ${t})`)}},int64:function(e=(()=>{}),t){return(i,n)=>{r.test(n)?BigInt(n)<(-2n)**(64n-1n)||BigInt(n)>2n**(64n-1n)-1n?i.error("must fit in a signed 64-bit integer"):result=void 0===t?e(i,Number(n)):e(i,Number(n),t):i.error(`must be an int64 (must match ${r})`)}},string:function(e=(()=>{}),t){return(r,i)=>{"string"!==a(i)?r.error("must be a string"):result=void 0===t?e(r,i):e(r,i,t)}},optString:function(e=(()=>{}),t){return(r,i)=>{"string"!==a(i)?"null"===a(i)?r.error("must be a string or able to cast to string"):result=void 0===t?e(r,String(i)):e(r,String(i),t):result=void 0===t?e(r,i):e(r,i,t)}},optStringFallback:function(e=(()=>{}),t){return(r,i)=>{"string"===a(i)?result=void 0===t?e(r,i):e(r,i,t):"null"!==a(i)?result=void 0===t?e(r,String(i)):e(r,String(i),t):result=void 0===t?e(r,""):e(r,"",t)}},object:function(e=(()=>{}),t){return(r,i)=>{"object"!==a(i)?r.error("must be an object"):result=void 0===t?e(r,i):e(r,i,t)}},array:function(e=(()=>{}),t){return(r,i)=>{"array"!==a(i)?r.error("must be an array"):result=void 0===t?e(r,i):e(r,i,t)}},optArray:function(e=(()=>{}),t,r){return(i,n)=>{if("array"!==a(n))return null!==t?a(n)===t?void(result=void 0===r?e(i,[n]):e(i,[n],r)):void i.error("must be a "+t+" or an array of "+t):"null"!==a(n)?void(result=void 0===r?e(i,[n]):e(i,[n],r)):void i.error("must be a array or able to cast to array");result=void 0===r?e(i,n):e(i,n,r)}},optional:function(e=(()=>{}),t){return(r,i,n)=>{i in n&&null!==n[i]&&(result=void 0===t?e(r,n[i]):e(r,n[i],t))}},getDataType:a,formatKeys:function(e){for(key in newJSON={},e)newJSON[key.toLowerCase()]=e[key];return newJSON},isValidAppDestinationHost:function(e,t,r){let i=g(t,e);e.errors.length>0||("android-app:"!==i.protocol&&e.error("app URL host/scheme is invalid"),r.expected_value.destination=[t])},isValidWebDestinationHost:function(e,r,i){for(element in r)if("string"!==a(element))return void e.error("must be a string or an array of strings");if(r.length>i.flags.max_distinct_web_destinations_in_source_registration)return void e.error("exceeded max distinct web destinations");if(0===r.length)return void e.error("no web destinations present");let o=[];for(let a=0;a<r.length;a++){let s=g(r[a],e);if(e.errors.length>0)return;if(!s.protocol)return void e.error("URL is missing scheme/protocol");if(!s.hostname)return void e.error("URL is missing hostname/domain");let l="";if("https:"!==s.protocol||"127.0.0.1"!==s.hostname&&"localhost"!==s.hostname){let r=s.hostname.toLowerCase().replace(".。．｡",".");if("."===r.charAt(r.length-1)&&(r=r.substring(0,r.length-1)),r.length>i.flags.max_web_destination_hostname_character_length)return void e.error("URL hostname/domain exceeds max character length");let a=r.split(".");if(a.length>i.flags.max_web_destination_hostname_parts)return void e.error("exceeded the max number of URL hostname parts");for(let r=0;r<a.length;r++){let o=a[r];if(o.length<i.flags.min_web_destination_hostname_part_character_length||o.length>i.flags.max_web_destination_hostname_part_character_length)return void e.error("URL hostname part character length must be in the range of 1-63");if(!o.match(n))return void e.error("URL hostname part character length must alphanumeric, hyphen, or underscore");if(invalidCharacters="-_",invalidCharacters.includes(o.charAt(0))||invalidCharacters.includes(o.charAt(o.length-1)))return void e.error("invalid URL hostname part starting/ending character (hypen/underscore)");if(r===a.length-1&&o.charAt(0).match(t))return void e.error("last hostname part can not start with a number")}if(l=s.protocol+"//"+r,g(l,e),e.errors.length>0)return}else if(l=s.protocol+"//"+s.hostname,g(l,e),e.errors.length>0)return;o.push(l)}i.expected_value.web_destination=[...new Set(o)]},isValidSourceFilterData:function(e,t,r){r.flags.can_include_lookback_window=!1,r.flags.should_check_filter_size=!0,"source_type"in t?e.error("filter: source_type is not allowed"):(d(e,t,r),0===e.errors.length&&(r.expected_value.filter_data=JSON.stringify(t)))},isValidTriggerMatchingData:function(e,t,r){"modulus"===t.toLowerCase()||"exact"===t.toLowerCase()?r.expected_value.trigger_data_matching=t.toUpperCase():e.error("value must be 'exact' or 'modulus' (case-insensitive)")},isValidAggregationKeys:function(e,t,r){if(Object.keys(t).length>r.flags.max_aggregate_keys_per_source_registration)e.error("exceeded max number of aggregation keys per source registration");else{for(aggregateKey in t){if(f(e,aggregateKey,r),e.errors.length>0)return;let i=t[aggregateKey];if("string"!==a(i)&&"null"!==a(i)&&(i=String(i)),b(e,i,r),e.errors.length>0)return}r.expected_value.aggregation_keys=JSON.stringify(t)}},isValidAttributionScopes:function(e,t,r){if("source"===r.header_options.header_type){if(!r.flags.attribution_scope_limit_present&&t.length>0)return void e.error("attribution scopes array must be empty if attribution scope limit is not present");if(!r.flags.attribution_scope_limit_present&&r.flags.max_event_states_present)return void e.error("max event states must not be present if attribution scope limit is not present");if(r.flags.attribution_scope_limit_present&&t.length>r.flags.attribution_scope_limit_value)return void e.error("attribution scopes array size exceeds the provided attribution_scope_limit")}for(let r=0;r<t.length;r++)if("string"!==a(t[r]))return void e.error("must be an array of strings");if(t.length>r.flags.max_32_bit_integer)e.error("exceeded max number of scopes per source");else{for(let i=0;i<t.length;i++)if(t[i].length>r.flags.max_32_bit_integer)return void e.error("exceeded max scope string length");r.expected_value.attribution_scopes="trigger"===r.header_options.header_type?JSON.stringify(t):t}},isValidAttributionScopeLimit:function(e,t,r){t<=0&&e.error("must be greater than 0"),r.flags.attribution_scope_limit_value=t,r.expected_value.attribution_scope_limit=t},isValidMaxEventStates:function(e,t,r){t<=0&&e.error("must be greater than 0"),t>r.flags.max_report_states_per_source_registration&&e.error("exceeds max report states per source registration"),r.expected_value.max_event_states=t},isValidXNetworkKeyMapping:function(e,t,r){for(key in t){if(xNetworkValue=t[key],null===xNetworkValue)return void e.error("all values must be non-null");if("string"!==a(xNetworkValue))return void e.error("all values must be strings");if(!xNetworkValue.startsWith("0x"))return void e.error("all values must start with 0x")}r.expected_value.x_network_key_mapping=JSON.stringify(t)},isValidAggregationCoordinatorOrigin:function(e,t,r){""!==t?(g(t,e),e.errors.length>0||(r.expected_value.aggregation_coordinator_origin=t)):e.error("value must be non-empty")},isValidAggregatableSourceRegistrationTime:function(e,t,r){"INCLUDE"===t.toUpperCase()||"EXCLUDE"===t.toUpperCase()?(r.flags.aggregatable_source_registration_time_value=t.toUpperCase(),r.expected_value.aggregatable_source_registration_time=t.toUpperCase()):e.error("must equal 'INCLUDE' or 'EXCLUDE' (case-insensitive)")},isValidTriggerContextId:function(e,t,r){"INCLUDE"!==r.flags.aggregatable_source_registration_time_value?t.length>r.flags.max_trigger_context_id_string_length?e.error("max string length exceeded"):r.expected_value.trigger_context_id=t:e.error("aggregatable_source_registration_time must not have the value 'INCLUDE'")},isValidEventTriggerData:function(e,t,r){r.flags.can_include_lookback_window=!0,r.flags.should_check_filter_size=!r.flags["feature-enable-update-trigger-header-limit"];for(let r=0;r<t.length;r++)if("object"!==a(t[r]))return void e.error("must be an array of object(s)");let i=[];for(let n=0;n<t.length;n++){let s=t[n],u={trigger_data:0};for(objKey in s){if("trigger_data"===objKey&&null!==s[objKey]){if("string"!==a(s[objKey]))return void e.error("'trigger_data' must be a string");if(!o(s[objKey],e,objKey))return;u[objKey]=Number(s[objKey])}if("priority"===objKey&&null!==s[objKey]){if("string"!==a(s[objKey]))return void e.error("'priority' must be a string");if(!l(s[objKey],e,objKey))return;u[objKey]=Number(s[objKey])}if("value"===objKey&&null!==s[objKey]){if("number"!==a(s[objKey]))return void e.error("'value' must be a number");if(!l(s[objKey],e,objKey))return;if(s[objKey]<1)return void e.error("'value' must be greater than 0");if(s[objKey]>r.flags.max_bucket_threshold)return void e.error("'value' exceeds max threshold of "+r.flags.max_bucket_threshold);u[objKey]=s[objKey]}if("deduplication_key"===objKey&&null!==s[objKey]){if("string"!==a(s[objKey]))return void e.error("'deduplication_key' must be a string");if(!o(s[objKey],e,objKey))return;u[objKey]=Number(s[objKey])}if(("filters"===objKey||"not_filters"===objKey)&&null!==s[objKey]){let t=y(s[objKey],e,objKey);if(e.errors.length>0)return;if(_(e,t,r,objKey),e.errors.length>0)return;u[objKey]=t}}i.push(u)}r.expected_value.event_trigger_data=JSON.stringify(i)},isValidAggregatableTriggerData:function(e,t,r){r.flags.can_include_lookback_window=!0,r.flags.should_check_filter_size=!r.flags["feature-enable-update-trigger-header-limit"];for(let r=0;r<t.length;r++)if("object"!==a(t[r]))return void e.error("must be an array of object(s)");for(let i=0;i<t.length;i++){if(!("key_piece"in t[i]))return void e.error("'key_piece' must be present in each element/object of the array");for(objKey in t[i]){if("key_piece"===objKey&&(b(e,t[i][objKey],r),e.errors.length>0))return;if("source_keys"===objKey&&null!==t[i][objKey]){if("array"!==a(t[i][objKey]))return void e.error("'source_keys' must be an array");if(r.flags.should_check_filter_size&&t[i][objKey].length>r.flags.max_aggregate_keys_per_trigger_registration)return void e.error("'source_keys' array size exceeds max aggregate keys per trigger registration limit");for(let n=0;n<t[i][objKey].length;n++){if("string"!==a(t[i][objKey][n]))return void e.error("each element in 'source_keys' must be a string");if(f(e,t[i][objKey][n],r,objKey),e.errors.length>0)return}}if("source_keys"in t[i]||(t[i].source_keys=[]),("filters"===objKey||"not_filters"===objKey)&&null!==t[i][objKey]){let n=y(t[i][objKey],e,objKey);if(e.errors.length>0)return;if(_(e,n,r,objKey),e.errors.length>0)return;t[i][objKey]=n}if("x_network_data"===objKey&&null!==t[i][objKey]&&"object"!==a(t[i][objKey]))return void e.error("'x_network_data' must be an object")}}r.expected_value.aggregatable_trigger_data=JSON.stringify(t)},isValidAggregatableValues:function(e,t,r){if(r.flags.should_check_filter_size=!r.flags["feature-enable-update-trigger-header-limit"],r.flags.should_check_filter_size&&Object.keys(t).length>r.flags.max_aggregate_keys_per_trigger_registration)e.error("exceeds max aggregate keys per trigger registration");else{for(aggregateKey in t){if(f(e,aggregateKey,r),e.errors.length>0)return;if("number"!==a(t[aggregateKey]))return void e.error("aggregate key value must be a number");if(!s(t[aggregateKey],e))return;if(t[aggregateKey]<1)return void e.error("aggregate key value must be greater than 0");if(t[aggregateKey]>r.flags.max_sum_of_aggregate_values_per_source)return void e.error("aggregate key value exceeds the max sum of aggregate values per source")}r.expected_value.aggregatable_values=JSON.stringify(t)}},isValidTriggerFilters:function(e,t,r){p(e,t,r,"filters")},isValidTriggerNotFilters:function(e,t,r){p(e,t,r,"not_filters")},isValidAggregatableDeduplicationKey:function(e,t,r){if(r.flags.can_include_lookback_window=!0,r.flags.should_check_filter_size=!r.flags["feature-enable-update-trigger-header-limit"],t.length>r.flags.max_aggregate_deduplication_keys_per_registration)return void e.error("exceeds max aggregate deduplication keys per registration limit");for(let r=0;r<t.length;r++)if("object"!==a(t[r]))return void e.error("must be an array of object(s)");let i=[];for(let n=0;n<t.length;n++){let s=t[n],l={};for(objKey in s){if("deduplication_key"===objKey&&null!==s[objKey]){if("string"!==a(s[objKey]))return void e.error(u(objKey,"'")+"must be a string");if(!o(s[objKey],e,objKey))return;l[objKey]=Number(s[objKey])}if(("filters"===objKey||"not_filters"===objKey)&&null!==s[objKey]){let t=y(s[objKey],e,objKey);if(e.errors.length>0)return;if(_(e,t,r,objKey),e.errors.length>0)return;l[objKey]=t}}i.push(l)}r.expected_value.aggregatable_deduplication_keys=JSON.stringify(i)},isValidAttributionConfig:function(e,t,r){for(let r=0;r<t.length;r++)if("object"!==a(t[r]))return void e.error("must be an array of object(s)");let i=r.flags.min_reporting_register_source_expiration_in_seconds,n=r.flags.max_reporting_register_source_expiration_in_seconds,o=[];for(let s=0;s<t.length;s++){let g=t[s],_={};if(!("source_network"in g)||null===g.source_network)return void e.error("'source_network' must be present and non-null in each element/object of the array");for(objKey in g){if("source_network"===objKey){if("null"===a(g[objKey]))return void e.error(u(objKey,"'")+"must be a string or able to cast to string");_[objKey]=String(g[objKey])}if("source_priority_range"===objKey&&null!==g[objKey]){if("object"!==a(g[objKey]))return void e.error(u(objKey,"'")+"must be an object");if(!("start"in g[objKey])||!("end"in g[objKey]))return void e.error(u(objKey,"'")+"both keys ('start','end') must be present");if(null===g[objKey].start||null===g[objKey].end)return void e.error(u(objKey,"'")+"both key values (start, end) must be string or able to cast to string");if(!l(g[objKey].start,e,"start")||!l(g[objKey].end,e,"end"))return;_[objKey]={start:Number(g[objKey].start),end:Number(g[objKey].end)}}if(("source_filters"===objKey||"source_not_filters"===objKey||"filter_data"===objKey)&&null!==g[objKey]){let t=y(g[objKey],e,objKey);if(e.errors.length>0)return;for(let i=0;i<t.length;i++)if(c(e,t[i],r),e.errors.length>0)return;_[objKey]=t}if(("source_expiry_override"===objKey||"expiry"===objKey)&&null!==g[objKey]){if(!l(g[objKey],e,objKey))return;let t=Number(g[objKey]);t<i?t=i:t>n&&(t=n),_[objKey]=t}if(("priority"===objKey||"post_install_exclusivity_window"===objKey)&&null!==g[objKey]){if(!l(g[objKey],e,objKey))return;_[objKey]=Number(g[objKey])}}o.push(_)}r.expected_value.attribution_config=JSON.stringify(o)},isValidExpiry:function(e,t,r){let i=r.flags.min_reporting_register_source_expiration_in_seconds,n=r.flags.max_reporting_register_source_expiration_in_seconds;var a,o;t<i?t=i:t>n&&(t=n),"event"===r.header_options.source_type&&(a=t,o=i,remainder=a%o,shouldRoundUp=remainder>=o/2||a==remainder,t=a-remainder+(shouldRoundUp?o:0)),r.expected_value.expiry=t,r.expected_value.aggregatable_report_window=1e3*t},isValidEventReportWindow:function(e,t,r){let i=r.flags.minimum_event_report_window_in_seconds,n=r.flags.max_reporting_register_source_expiration_in_seconds;t<i?t=i:t>n&&(t=n),t=Math.min(r.expected_value.expiry,t),r.expected_value.event_report_window=1e3*t,r.flags.effective_expiry=r.expected_value.event_report_window},isValidAggregatableReportWindow:function(e,t,r){let i=r.flags.minimum_aggregatable_report_window_in_seconds,n=r.flags.max_reporting_register_source_expiration_in_seconds;t<i?t=i:t>n&&(t=n),t=Math.min(r.expected_value.expiry,t),r.expected_value.aggregatable_report_window=1e3*t},isValidLocation:function(e,t,r){url=g(t,e),e.errors.length>0||(behavior="AS_IS",null!==r.expected_value["attribution-reporting-redirect-config"]&&"redirect-302-to-well-known"===r.expected_value["attribution-reporting-redirect-config"].toLowerCase()&&(behavior="LOCATION_TO_WELL_KNOWN",url=function(e){return wellKnownPathSegment=".well-known/attribution-reporting/register-redirect",wellKnownQueryParam="302_url",e+"/"+wellKnownPathSegment+"?"+wellKnownQueryParam+"="+encodeURIComponent(e)}(t)),r.expected_value.location=[{uri:url.toString(),redirect_behavior:behavior}])},isValidAttributionReportingRedirect:function(e,t,r){t.length>r.flags.max_registration_redirects&&e.warning("max allowed reporting redirects: "+r.flags.max_registration_redirects+", all other reporting redirects will be ignored");let i=[];for(let n=0;n<Math.min(t.length,r.flags.max_registration_redirects);n++){if("string"!==a(t[n]))return void e.error("must be an array of strings");if(url=g(t[n],e),e.errors.length>0)return;i.push({uri:t[n],redirect_behavior:"AS_IS"})}r.expected_value["attribution-reporting-redirect"]=i},isValidAttributionReportingRedirectConfig:function(e,t,r){r.expected_value["attribution-reporting-redirect-config"]=t},isValidInstallAttributionWindow:function(e,t,r){let i=r.flags.min_install_attribution_window,n=r.flags.max_install_attribution_window;t<i?t=i:t>n&&(t=n),r.expected_value.install_attribution_window=1e3*t},isValidPostInstallExclusivityWindow:function(e,t,r){let i=r.flags.min_post_install_exclusivity_window,n=r.flags.max_post_install_exclusivity_window;t<i?t=i:t>n&&(t=n),r.expected_value.post_install_exclusivity_window=1e3*t},isValidReinstallReattributionWindow:function(e,t,r){let i=r.flags.max_reinstall_reattribution_window_seconds;t<0?t=0:t>i&&(t=i),r.expected_value.reinstall_reattribution_window=1e3*t},isValidDebugAdId:function(e,t,r){r.expected_value.debug_ad_id=t},isValidDebugJoinKey:function(e,t,r){r.expected_value.debug_join_key=t},isValidSourceEventId:function(e,t,r){r.expected_value.source_event_id=t},isValidPriority:function(e,t,r){r.expected_value.priority=t},isValidDebugKey:function(e,t,r){r.expected_value.debug_key=t},isValidDebugReporting:function(e,t,r){r.expected_value.debug_reporting=t},isValidCoarseEventReportDestinations:function(e,t,r){r.expected_value.coarse_event_report_destinations=t},isValidSharedDebugKey:function(e,t,r){r.expected_value.shared_debug_key=t},isValidSharedAggregationKeys:function(e,t,r){r.expected_value.shared_aggregation_keys=JSON.stringify(t)},isValidSharedFilterDataKeys:function(e,t,r){r.expected_value.shared_filter_data_keys=JSON.stringify(t)},isValidDropSourceIfInstalled:function(e,t,r){r.expected_value.drop_source_if_installed=t}}},924:(e,t,r)=>{const{State:i,optional:n,string:a,array:o,isValidLocation:s,isValidAttributionReportingRedirect:l,isValidAttributionReportingRedirectConfig:u,formatKeys:g}=r(32);e.exports={validateRedirect:function(e,t){try{redirectJSON=JSON.parse(e),redirectJSON=g(redirectJSON)}catch(e){return{result:{errors:[e instanceof Error?e.toString():"unknown error"],warnings:[]},expected_value:{}}}const r=new i;let _={};return t.expected_value=(redirectJSON,{location:null,"attribution-reporting-redirect":null,"attribution-reporting-redirect-config":null}),_["attribution-reporting-redirect-config"]=n(a(u,t)),_["attribution-reporting-redirect"]=n(o(l,t)),_.location=n(a(s,t)),r.validate(redirectJSON,_),{result:r.result(),expected_value:t.expected_value}}}},554:(e,t,r)=>{const{State:i,optBoolean:n,optBooleanFallback:a,uint64:o,int64:s,string:l,optString:u,optStringFallback:g,object:_,array:d,optArray:c,optional:f,formatKeys:b,isValidAppDestinationHost:p,isValidWebDestinationHost:y,isValidSourceFilterData:m,isValidTriggerMatchingData:h,isValidAggregationKeys:v,isValidAttributionScopes:x,isValidAttributionScopeLimit:w,isValidMaxEventStates:k,isValidExpiry:j,isValidEventReportWindow:K,isValidAggregatableReportWindow:S,isValidInstallAttributionWindow:V,isValidPostInstallExclusivityWindow:N,isValidReinstallReattributionWindow:O,isValidDebugAdId:A,isValidDebugJoinKey:E,isValidSourceEventId:D,isValidPriority:I,isValidDebugKey:C,isValidDebugReporting:J,isValidCoarseEventReportDestinations:R,isValidSharedDebugKey:L,isValidSharedAggregationKeys:U,isValidSharedFilterDataKeys:B,isValidDropSourceIfInstalled:T}=r(32);e.exports={validateSource:function(e,t){try{sourceJSON=JSON.parse(e),sourceJSON=b(sourceJSON)}catch(e){return{result:{errors:[e instanceof Error?e.toString():"unknown error"],warnings:[]},expected_value:{}}}const r=new i;let W={};return"destination"in sourceJSON&&null!==sourceJSON.destination||"web_destination"in sourceJSON&&null!==sourceJSON.web_destination?(t.expected_value={source_event_id:0,debug_key:null,destination:null,expiry:(z=t.flags).max_reporting_register_source_expiration_in_seconds,event_report_window:null,aggregatable_report_window:1e3*z.max_reporting_register_source_expiration_in_seconds,priority:0,install_attribution_window:1e3*z.max_install_attribution_window,post_install_exclusivity_window:1e3*z.min_post_install_exclusivity_window,reinstall_reattribution_window:0,filter_data:null,web_destination:null,aggregation_keys:null,shared_aggregation_keys:null,debug_reporting:!1,debug_join_key:null,debug_ad_id:null,coarse_event_report_destinations:!1,shared_debug_key:null,shared_filter_data_keys:null,drop_source_if_installed:!1,trigger_data_matching:"MODULUS",attribution_scopes:null,attribution_scope_limit:null,max_event_states:3},W.destination=f(u(p,t)),W.source_event_id=f(l(o(D,t))),W.expiry=f(u(o(j,t))),W.event_report_window=f(u(o(K,t))),W.aggregatable_report_window=f(u(o(S,t))),W.priority=f(l(s(I,t))),W.debug_key=f(l(o(C,t))),W.debug_reporting=f(a(J,t)),W.install_attribution_window=f(u(s(V,t))),W.post_install_exclusivity_window=f(u(s(N,t))),W.debug_ad_id=f(g(A,t)),W.debug_join_key=f(g(E,t)),W.web_destination=f(c(y,"string",t)),W.filter_data=f(_(m,t)),W.aggregation_keys=f(_(v,t)),t.flags["feature-attribution-scopes"]&&(t.flags.max_event_states_present="max_event_states"in sourceJSON,t.flags.attribution_scope_limit_present="attribution_scope_limit"in sourceJSON,W.attribution_scope_limit=f(u(s(w,t))),W.max_event_states=f(u(s(k,t))),W.attribution_scopes=f(d(x,t))),t.flags["feature-trigger-data-matching"]&&(W.trigger_data_matching=f(u(h,t))),t.flags["feature-coarse-event-report-destination"]&&(W.coarse_event_report_destinations=f(n(R,t))),t.flags["feature-shared-source-debug-key"]&&(W.shared_debug_key=f(u(o(L,t)))),t.flags["feature-xna"]&&(W.shared_aggregation_keys=f(d(U,t))),t.flags["feature-shared-filter-data-keys"]&&(W.shared_filter_data_keys=f(d(B,t))),t.flags["feature-preinstall-check"]&&(W.drop_source_if_installed=f(n(T,t))),t.flags["feature-enable-reinstall-reattribution"]&&(W.reinstall_reattribution_window=f(u(s(O,t)))),r.validate(sourceJSON,W),{result:r.result(),expected_value:t.expected_value}):{result:{errors:[{path:["destination or web_destination"],msg:"At least one field must be present and non-null",formattedError:"at least one field must be present and non-null: `destination or web_destination`"}],warnings:[]},expected_value:{}};var z}}},731:(e,t,r)=>{const{State:i,optional:n,uint64:a,string:o,array:s,optBooleanFallback:l,optString:u,optStringFallback:g,object:_,formatKeys:d,isValidAttributionScopes:c,isValidXNetworkKeyMapping:f,isValidAggregationCoordinatorOrigin:b,isValidAggregatableSourceRegistrationTime:p,isValidTriggerContextId:y,isValidEventTriggerData:m,isValidAggregatableTriggerData:h,isValidAggregatableValues:v,isValidTriggerFilters:x,isValidTriggerNotFilters:w,isValidAggregatableDeduplicationKey:k,isValidAttributionConfig:j,isValidDebugKey:K,isValidDebugJoinKey:S,isValidDebugReporting:V,isValidDebugAdId:N}=r(32);e.exports={validateTrigger:function(e,t){try{triggerJSON=JSON.parse(e),triggerJSON=d(triggerJSON)}catch(e){return{result:{errors:[e instanceof Error?e.toString():"unknown error"],warnings:[]},expected_value:{}}}const r=new i;let O={};return t.expected_value={attribution_config:null,event_trigger_data:"[]",filters:null,not_filters:null,aggregatable_trigger_data:null,aggregatable_values:null,aggregatable_deduplication_keys:null,debug_key:null,debug_reporting:!1,x_network_key_mapping:null,debug_join_key:null,debug_ad_id:null,aggregation_coordinator_origin:null,aggregatable_source_registration_time:t.flags["feature-source-registration-time-optional-for-agg-reports"]?"EXCLUDE":"INCLUDE",trigger_context_id:null,attribution_scopes:null},O.debug_key=n(o(a(K,t))),O.debug_join_key=n(g(S,t)),O.debug_reporting=n(l(V,t)),O.debug_ad_id=n(g(N,t)),O.event_trigger_data=n(s(m,t)),O.aggregatable_trigger_data=n(s(h,t)),O.aggregatable_values=n(_(v,t)),O.filters=n(x,t),O.not_filters=n(w,t),O.aggregatable_deduplication_keys=n(s(k,t)),t.flags["feature-attribution-scopes"]&&(O.attribution_scopes=n(s(c,t))),t.flags["feature-xna"]&&(O.x_network_key_mapping=n(_(f,t)),O.attribution_config=n(s(j,t))),t.flags["feature-aggregation-coordinator-origin"]&&(O.aggregation_coordinator_origin=n(u(b,t))),t.flags["feature-source-registration-time-optional-for-agg-reports"]&&(O.aggregatable_source_registration_time=n(g(p,t))),t.flags["feature-trigger-context-id"]&&(O.trigger_context_id=n(o(y,t))),r.validate(triggerJSON,O),{result:r.result(),expected_value:t.expected_value}}}}},t={};function r(i){var n=t[i];if(void 0!==n)return n.exports;var a=t[i]={exports:{}};return e[i](a,a.exports,r),a.exports}(()=>{const{validateSource:e}=r(554),{validateTrigger:t}=r(731),{validateRedirect:i}=r(924),n=document.getElementById("validation-form"),a=document.getElementById("input-text"),o=document.getElementById("effective"),s=n.elements.namedItem("header"),l=document.getElementById("linkify"),u=document.getElementById("errors"),g=document.getElementById("warnings"),_=document.getElementById("notes"),d=document.getElementById("success"),c=document.getElementById("source-type-options"),f=n.elements.namedItem("source-type");function b(e,t){e.replaceChildren([]),t.forEach((function(t){let r=document.createElement("li");r.textContent="string"==typeof t?t:t.msg+": "+t.path,e.appendChild(r)}))}function p(){c.disabled="source"!=s.value;let r={"feature-lookback-window-filter":!0,"feature-trigger-data-matching":!0,"feature-coarse-event-report-destination":!0,"feature-shared-source-debug-key":!0,"feature-xna":!0,"feature-shared-filter-data-keys":!0,"feature-preinstall-check":!0,"feature-attribution-scopes":!1,"feature-aggregation-coordinator-origin":!0,"feature-source-registration-time-optional-for-agg-reports":!0,"feature-trigger-context-id":!0,"feature-enable-update-trigger-header-limit":!1,"feature-enable-reinstall-reattribution":!1,max_attribution_filters:50,max_bytes_per_attribution_filter_string:25,max_values_per_attribution_filter:50,max_distinct_web_destinations_in_source_registration:3,max_web_destination_hostname_character_length:253,max_web_destination_hostname_parts:127,min_web_destination_hostname_part_character_length:1,max_web_destination_hostname_part_character_length:63,max_aggregate_keys_per_source_registration:50,max_bytes_per_attribution_aggregate_key_id:25,min_bytes_per_aggregate_value:3,max_bytes_per_aggregate_value:34,max_report_states_per_source_registration:(1n<<32n)-1n,max_trigger_context_id_string_length:64,max_bucket_threshold:(1n<<32n)-1n,max_filter_maps_per_filter_set:20,max_aggregate_keys_per_trigger_registration:50,max_sum_of_aggregate_values_per_source:65536,max_aggregate_deduplication_keys_per_registration:50,min_reporting_register_source_expiration_in_seconds:86400,max_reporting_register_source_expiration_in_seconds:2592e3,minimum_event_report_window_in_seconds:3600,minimum_aggregatable_report_window_in_seconds:3600,min_install_attribution_window:86400,max_install_attribution_window:2592e3,min_post_install_exclusivity_window:0,max_post_install_exclusivity_window:2592e3,max_reinstall_reattribution_window_seconds:7776e3,max_registration_redirects:20};r.max_32_bit_integer=Math.pow(2,31)-1;let n,l,p={flags:r,header_options:{header_type:s.value,source_type:null},expected_value:null};"source"===s.value?(p.header_options.source_type=f.value,l=e(a.value,p),n=l.result):"trigger"===s.value?(l=t(a.value,p),n=l.result):"redirect"===s.value&&(l=i(a.value,p),n=l.result),d.textContent=0===n.errors.length?"The header is valid.":"",b(u,n.errors),b(g,n.warnings),b(_,[]),0===n.errors.length?o.textContent=JSON.stringify(l.expected_value,null,2):o.textContent=""}n.addEventListener("input",p),l.addEventListener("click",(async function(){const e=new URL(location.toString());e.search="",e.searchParams.set("header",s.value),e.searchParams.set("json",a.value),"source"===e.searchParams.get("header")&&e.searchParams.set("source-type",f.value),await navigator.clipboard.writeText(e.toString())})),function(){let e=new URLSearchParams(location.search),t=e.get("json"),r=e.get("header"),i=e.get("source-type");t&&(a.value=t),r&&(s.value=r),i&&(f.value=i)}(),p()})()})();