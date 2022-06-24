# Diploma
Diploma project

#In addition to the auto generated SQL code should add:
## 1. To the "notifications" table
 ### 1.1 Trigger fuction:
 ```
   CREATE OR REPLACE FUNCTION public.bef_upd_notifications_to_del()
      RETURNS trigger
      LANGUAGE 'plpgsql'
      COST 100
      VOLATILE NOT LEAKPROOF
  AS $BODY$
  BEGIN
    IF NOT EXISTS (SELECT FROM "usersNotifications" WHERE "usersNotifications"."notificationId"=OLD.id) THEN
      DELETE FROM notifications 
        WHERE notifications.id=OLD.id;
      RETURN NULL;
    END IF;
    RETURN NEW;
    END
    $BODY$;
  ```
 ### 1.2 Trigger:
 ```
     CREATE TRIGGER bef_upd_to_del
      BEFORE UPDATE OF "senderId"
      ON public.notifications
      FOR EACH ROW
      WHEN (new."senderId" IS NULL)
      EXECUTE FUNCTION public.bef_upd_notifications_to_del();
 ```
 ## 2. To the "usersNotifications" table
  ### 2.1 Trigger function:
  ```
   CREATE OR REPLACE FUNCTION public.after_del_usersnotifs_trigger_func()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
  AS $BODY$
    BEGIN
      DELETE FROM notifications 
      WHERE notifications.id=OLD."notificationId" 
	    AND notifications."senderId" IS NULL
	    AND NOT EXISTS (SELECT FROM "usersNotifications" WHERE "usersNotifications"."notificationId"=OLD."notificationId");
    RETURN OLD;
    END
    $BODY$;
   ```
   ### 2.2 Trigger
   ```
    CREATE TRIGGER aft_del
    AFTER DELETE
    ON public."usersNotifications"
    FOR EACH ROW
    EXECUTE FUNCTION public.after_del_usersnotifs_trigger_func();
  ```    
