import { CronJob as Job } from 'cron'
import { isValidCron } from 'cron-validator'
import { InjectionToken, container } from 'tsyringe'

export function CronJob(cronExprecion: string, jobName?: string) {
    if (!isValidCron(cronExprecion, { alias: true, seconds: true })) {
        throw new Error(`Expreção cron invalida: ${cronExprecion}`)
    }

    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const oldDescriptor = descriptor.value

        descriptor.value = function (...args: any[]) {
            return oldDescriptor.apply(
                container.resolve(this.constructor as InjectionToken<any>),
                args
            )
        }

        const job = new Job(
            cronExprecion,
            descriptor.value,
            null,
            false,
            undefined,
            target
        )

        import('@services').then(({ Cron }) => {
            const cron = container.resolve(Cron)
            cron.addJob(jobName ?? propertyKey, job)
        })
    }
}
