
#import "RNRecyclerListItemViewManager.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>

typedef void (^ListItemViewBlock)(RecyclerListItemView *listItemView);

@implementation RNRecyclerListItemViewManager

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (UIView *)view
{
    return [[RecyclerListItemView alloc] init];
}

- (void)executeBlock:(ListItemViewBlock)block onNode:(NSNumber *)node {
    
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[node];
        if (![view isKindOfClass:[RecyclerListItemView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNReactNativeTableView, got: %@", view);
            return;
        }
        RecyclerListItemView *item = view;
        if (block) {
            block(item);
        }
    }];
}

RCT_CUSTOM_VIEW_PROPERTY(itemIndex, NSInteger, RecyclerListItemView)
{
    view.itemIndex = [RCTConvert NSInteger:json];
}

@end

