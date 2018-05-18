
#import "RNRecyclerListViewManager.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>

typedef void (^ListViewBlock)(RecyclerListView *listView);

@implementation RNRecyclerListViewManager

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (UIView *)view
{
    return [[RecyclerListView alloc] init];
}

- (void)executeBlock:(ListViewBlock)block onNode:(NSNumber *)node {
    
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        id view = viewRegistry[node];
        if (![view isKindOfClass:[RecyclerListView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNReactNativeTableView, got: %@", view);
            return;
        }
        RecyclerListView *listView = view;
        if (block) {
            block(listView);
        }
    }];
}

RCT_EXPORT_METHOD(scrollToIndex:(nonnull NSNumber *)node index:(NSInteger)index animated:(BOOL)animated)
{
    RCTLogInfo(@"Scroll to index %i at %i", (int)index, animated);
    [self executeBlock:^(RecyclerListView *listView) {
        [listView scrollTo:index animated:animated];
    } onNode:node];
}

RCT_EXPORT_METHOD(notifyDataSetChanged:(nonnull NSNumber *)node size:(NSInteger)size )
{
    RCTLogInfo(@"Dataset changed size to %i", (int)size);
    [self executeBlock:^(RecyclerListView *listView) {
        listView.dataSize = size;
    } onNode:node];
}

RCT_EXPORT_METHOD(notifyItemMoved:(nonnull NSNumber *)node indexFromPosition:(NSInteger)from toPosition:(NSInteger)to)
{
    RCTLogInfo(@"Dataset moved item from %i to %i", (int)from, (int)to);
    [self executeBlock:^(RecyclerListView *listView) {
        [listView moveCellFrom:from to:to];
    } onNode:node];
}

RCT_EXPORT_METHOD(notifyItemRangeInserted:(nonnull NSNumber *)node position:(NSInteger)position count:(NSInteger)count )
{
    RCTLogInfo(@"Dataset inserted at position %i, %i items", (int)position, (int)count);
    [self executeBlock:^(RecyclerListView *listView) {
        [listView insertItemsAt:position amount:count];
    } onNode:node];
}

RCT_EXPORT_METHOD(notifyItemRangeRemoved:(nonnull NSNumber *)node position:(NSInteger)position count:(NSInteger)count )
{
    RCTLogInfo(@"Dataset removed at position %i, %i items", (int)position, (int)count);
    [self executeBlock:^(RecyclerListView *listView) {
        [listView removeItemsAt:position amount:count];
    } onNode:node];
}


RCT_CUSTOM_VIEW_PROPERTY(itemCount, NSInteger, RecyclerListView)
{
    view.dataSize = [RCTConvert NSInteger:json];
}

RCT_EXPORT_VIEW_PROPERTY(onVisibleItemsChange, RCTBubblingEventBlock)

RCT_EXPORT_MODULE()

@end

