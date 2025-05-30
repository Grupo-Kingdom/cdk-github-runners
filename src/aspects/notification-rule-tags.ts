import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import * as notifications from 'aws-cdk-lib/aws-codestarnotifications';

/**
 * Fix tag format for `AWS::CodeStarNotifications::NotificationRule` resources.
 *
 * Some CloudFormation versions expect the `Tags` property to be an array of
 * key/value pairs, but CDK currently renders these tags as a map under the
 * `tags` property. This aspect converts the tags to the correct format and
 * removes the original property.
 */
export class NotificationRuleTagFixer implements cdk.IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof notifications.CfnNotificationRule) {
      const tags = node.tags.tagValues();
      if (Object.keys(tags).length > 0) {
        const list = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
        node.addOverride('Properties.Tags', list);
        node.addDeletionOverride('Properties.tags');
      }
    }
  }
}
