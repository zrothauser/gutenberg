
#import "RNReactNativeRecyclerviewList.h"
#import "RNReactNativeTableView.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RNReactNativeRecyclerviewList

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (UIView *)view
{
    return [[RNReactNativeTableView alloc] init];
}

RCT_EXPORT_METHOD(scrollToIndex:(nonnull NSNumber *)node index:(NSInteger)index animated:(BOOL)animated)
{
    RCTLogInfo(@"Pretending to scroll to index %i at %i", (int)index, animated);
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[node];
        if (![view isKindOfClass:[RNReactNativeTableView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNReactNativeTableView, got: %@", view);
            return;
        }
        RNReactNativeTableView *tableView = view;
        [tableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:index inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:animated];
    }];
}

RCT_EXPORT_MODULE()

@end
  
